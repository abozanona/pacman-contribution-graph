import http from 'http';
import { PacmanRenderer } from 'pacman-contribution-graph';
import querystring from 'querystring';
import url from 'url';

const githubToken = process.env.GITHUB_ACCESS_TOKEN;

const generateSvg = async (userName, platform, gameTheme) => {
    return new Promise((resolve) => {
        const conf = {
            platform: platform,
            username: userName,
            outputFormat: "svg",
            gameSpeed: 1,
            gameTheme: gameTheme,
            githubSettings: {
                accessToken: githubToken
            },
            svgCallback: (animatedSVG) => resolve(animatedSVG)
        };

        const pr = new PacmanRenderer(conf);
        pr.start();
    });
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query);
    const username = queryParams.username || 'abozanona';
    const platform = queryParams.platform || 'github';
    const gameTheme = queryParams.gameTheme || 'github-dark';

    try {
        const svg = await generateSvg(username, platform, gameTheme);
        res.writeHead(200, {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.end(svg.replace("Generated with ", "Generated with " + username + " "));
    } catch (error) {
        res.end('Error generating SVG');
        throw error;
    }
});

server.listen();