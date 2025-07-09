# Pac-Man Contribution Graph Game

Transform your GitHub or GitLab contribution graph into an interactive Pac-Man game! This JavaScript library offers a unique and engaging way to visualize your coding activity over the past year.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/pacman-contribution-graph-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/pacman-contribution-graph.svg">
  <img alt="pacman contribution graph" src="https://raw.githubusercontent.com/abozanona/abozanona/output/pacman-contribution-graph.svg">
</picture>

> **Note:**  
> This tool visualizes only your **public contributions** as shown on your GitHub profile.  
> Private contributions are not included due to GitHub's privacy policy.

## Features

Elevate your GitHub profile with the Pac-Man Contribution Graph Game and add a playful touch to your coding journey!

- **Contribution Visualization**: Converts your GitHub or GitLab contribution data into a colorful grid.
- **Interactive Gameplay**: Navigate Pac-Man through your contributions, evading ghosts and collecting pellets.
- **Multiple Themes**: Choose between different themes, such as GitHub Dark and GitLab Dark.
- **Customizable Settings**: Adjust game speed, sound preferences, and output format (Canvas or SVG).
- **NEW: Real Contribution Mapping**: Pac-Man and ghosts now move through your **actual public contribution graph** (not a generic or demo grid).
- **NEW: Improved Accuracy**: Uses GitHub's real color scheme and grid layout for a faithful representation.
- **NEW: Enhanced Game Mechanics**: Ghosts and Pac-Man only move where you have contributed.

## Demo

Experience the game firsthand:

**Live Demo**: [Pac-Man Contribution Game](https://abozanona.github.io/pacman-contribution-graph/)

## Installation

To integrate the Pac-Man Contribution Graph into your project, you can install it via npm:

```bash
npm install pacman-contribution-graph
```

Alternatively, include it directly in your HTML using jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/pacman-contribution-graph@1.0.10/dist/index.min.js"></script>
```

## Usage

Here's how to set up and run the Pac-Man Contribution Graph:

1. **Include the Library**: Ensure the library is included in your project, either via npm or a script tag.
2. **Initialize the Game**: Use the following code to generate the game:

    ```javascript
    import { generatePacManGame } from 'pacman-contribution-graph';

    generatePacManGame({
        username: 'your_username',
        platform: 'github', // or 'gitlab'
        theme: 'github-dark', // or 'gitlab-dark'
        speed: 2,
        sound: true,
        output: 'canvas' // or 'svg'
    });
    ```

3. **Customize Settings**: Adjust the parameters as needed:
    - `username`: Your GitHub or GitLab username.
    - `platform`: Specify `'github'` or `'gitlab'`.
    - `theme`: Choose between available themes.
    - `speed`: Set the game speed (e.g., `1` for normal, `2` for fast).
    - `sound`: Enable or disable sound (`true` or `false`).
    - `output`: Select `'canvas'` for browser play or `'svg'` for a downloadable animated SVG.

## Integrate into Your GitHub Profile

To showcase the Pac-Man game on your GitHub profile, follow these steps:

1. **Create a Special Repository**:

    - Name a new repository exactly as your GitHub username (e.g., `username/username`).
    - This repository powers your GitHub profile page.

2. **Set Up GitHub Actions**:

    - In the repository, create a `.github/workflows/` directory.
    - Add a `main.yml` file with the following content:

        ```yaml
        name: generate pacman game

        on:
        schedule: # Run automatically every 24 hours
            - cron: "0 */24 * * *"
        workflow_dispatch: # Allows manual triggering
        push: # Runs on every push to the main branch
            branches:
            - main

        jobs:
        generate:
            permissions:
            contents: write
            runs-on: ubuntu-latest
            timeout-minutes: 5

            steps:
            - name: generate pacman-contribution-graph.svg
                uses: abozanona/pacman-contribution-graph@main
                with:
                github_user_name: ${{ github.repository_owner }}

            # Push the generated SVG to the output branch
            - name: push pacman-contribution-graph.svg to the output branch
                uses: crazy-max/ghaction-github-pages@v3.1.0
                with:
                target_branch: output
                build_dir: dist
                env:
                GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        ```

3. **Add to Profile README**:

    - In your repository, create or edit the `README.md` file to include:

        ```markdown
        ## My Contribution Graph

        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/pacman-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/pacman-contribution-graph.svg">
            <img alt="pacman contribution graph" src="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/pacman-contribution-graph.svg">
        </picture>
        ```

4. **Commit and Push**:
    - Push the changes to GitHub. The GitHub Actions workflow will run daily, updating the Pac-Man game on your profile.

For a detailed guide, refer to the blog post: [Integrate Pac-Man Contribution Graph into your GitHub Profile](https://abozanona.me/integrate-pacman-contribution-graph-into-github/)

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## Acknowledgements

Inspired by the [snk](https://github.com/Platane/snk) project, which turns your GitHub contribution graph into a snake game. Special thanks to all contributors and the open-source community for their support.

## Online tools that use Pac-Man Contribution Graph Game

- Profile Readme Generator: [Website](https://profile-readme-generator.com/) • [Pull Request](https://github.com/maurodesouza/profile-readme-generator/pull/98)
