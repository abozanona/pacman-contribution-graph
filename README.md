# 👻🧱🚀 Arcade Contribution Graph Games

![Active users count][active-users-shield]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Contributors][contributors-shield]][contributors-url]
[![Stand with Palestine][stand-with-palestine-shield]][stand-with-palestine-url]
[![Buy Me a Coffee][buy-me-a-coffee-shield]][buy-me-a-coffee-url]

Transform your GitHub or GitLab contribution graph into arcade games! This JavaScript library offers a unique and engaging way to visualize your coding activity over the past year.

## 🕹️ Available Games

| Game                 | Game Name     | Description                                                          |
| -------------------- | ------------- | -------------------------------------------------------------------- |
| 👻 **Pac-Man**       | pacman        | Pac-Man eats your contributions while ghosts give chase              |
| 🧱 **Breakout**      | breakout      | A ball bounces around breaking your contribution bricks              |
| 🚀 **Galaga**        | galaga        | A fighter ship shoots lasers at your contribution grid               |
| 🫧 **Puzzle Bobble** | puzzle-bobble | A cannon fires colored bubbles to pop matching contribution clusters |
| 💣 **Bomberman**     | bomberman     | Two bombers blast contribution cells across the graph                |
| 💠 **Minesweeper**   | minesweeper   | A solver clears cells, flags guaranteed mines, and survives guesses  |

More games coming soon!

### Pac-Man preview

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/demo/pacman-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/demo/pacman.svg">
    <img alt="pacman contribution graph" src="assets/demo/pacman.svg">
</picture>

### Breakout preview

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/demo/breakout-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/demo/breakout.svg">
    <img alt="breakout contribution graph" src="assets/demo/breakout.svg">
</picture>

### Galaga preview

<picture>
    <img alt="galaga contribution graph" src="assets/demo/galaga.svg">
</picture>

### Puzzle Bobble preview

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/demo/puzzle-bobble-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/demo/puzzle-bobble.svg">
    <img alt="puzzle bobble contribution graph" src="assets/demo/puzzle-bobble.svg">
</picture>

### Bomberman preview

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/demo/bomberman-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/demo/bomberman.svg">
    <img alt="bomberman contribution graph" src="assets/demo/bomberman.svg">
</picture>

### Minesweeper preview

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/demo/minesweeper-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/demo/minesweeper.svg">
    <img alt="bomberman contribution graph" src="assets/demo/minesweeper.svg">
</picture>

## 🎮 Features

Elevate your GitHub profile with the Pac-Man Contribution Graph Game and add a playful touch to your coding journey!

- **Contribution Visualization**: Converts your GitHub or GitLab contribution data into a colorful grid.
- **Multiple Games**: Classic Pac-Man, Breakout, Galaga, Puzzle Bobble, Bomberman, and Minesweeper, with more planned
- **Multiple Themes**: Choose between different themes, such as GitHub Dark and GitLab Dark.
- **Customizable Settings**: Adjust game settings.
- **GitHub Integration**: Automatically fetches your contribution data via GraphQL API
- **GitHub Action**: Easy to add to your profile or website README

## 🕹️ Demo

Experience the games firsthand:
**Live Demo**: [Pac-Man Contribution Game](https://abozanona.github.io/pacman-contribution-graph/)

## 🔧 Installation

To integrate the Pac-Man Contribution Graph into your project, you can install it via npm:

```bash
npm install pacman-contribution-graph
```

Alternatively, include it directly in your HTML using jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/pacman-contribution-graph/dist/pacman-contribution-graph.min.js"></script>
```

## 🧩 Usage

Here's how to set up and run the games:

1. **Include the Library**: Ensure the library is included in your project, either via npm or a script tag.
2. **Initialize the Game**: Use the following code to generate an arcade game:

    ```javascript
    import { ArcadeRenderer } from 'pacman-contribution-graph';

    // Replace [game-name] with a valid game name
    const renderer = new ArcadeRenderer({
    	game: '[game-name]',
    	username: 'your_username',
    	platform: 'github', // or 'gitlab'
    	gameTheme: 'github-dark', // 'github', 'github-dark', 'gitlab', or 'gitlab-dark'
    	playerStyle: 'opportunistic', // Pac-Man only: 'conservative', 'aggressive', or 'opportunistic'
    	svgCallback: (svg) => {
    		// called with the generated SVG string
    		document.getElementById('output').innerHTML = svg;
    	},
    	gameOverCallback: () => {
    		console.log('Game over!');
    	},
    	pointsIncreasedCallback: (points) => {
    		console.log('Score:', points);
    	}
    });
    renderer.start();
    ```

3. **Customize Settings**: Adjust the parameters as needed:
    - `game`: The arcade game name to generate. For valid names, see table above.
    - `username`: Your GitHub or GitLab username.
    - `platform`: Specify `'github'`, `'gitlab'` or `'scenario'`.
    - `gameTheme`: Choose between `'github'`, `'github-dark'`, `'gitlab'`, or `'gitlab-dark'`.
    - `scenario`: Use a predefined contribution scenario instead of fetching platform contributions. Available scenarios: `full`, `empty`, `random`, `checkerboard`, `gradient`, `streaks`. This option is only active when `platform` is set to `'scenario'`; with `platform: 'github'` or `platform: 'gitlab'`, real platform contributions are fetched and the scenario value is ignored.
    - `playerStyle` _(Pac-Man only)_: `PlayerStyle.OPPORTUNISTIC` (default), `PlayerStyle.CONSERVATIVE`, or `PlayerStyle.AGGRESSIVE`.
    - `showMonthLabels`: `true` (default) renders the month labels row above the grid; set to `false` for a cleaner, header-free SVG.
    - `svgCallback`: Called with the finished SVG string once generation is complete.
    - `gameOverCallback`: Called when the game finishes.
    - `pointsIncreasedCallback`: Called each time the score increases.
    - `gameStatsCallback`: Called at the end with `{ totalScore, steps, ghostsEaten }`.
    - `githubSettings`: `{ accessToken: 'your_token' }` for private contribution data.

### CLI

#### Basic

```bash
pacman-contribution-graph --game pacman --username demo --platform github --gameTheme github --output pacman-contribution-graph.svg
```

Use this mode for real contribution data from GitHub or GitLab. `--platform` and `--username` are required; `--game`, `--gameTheme`, and `--output` are optional.

#### Scenario

```bash
pacman-contribution-graph --game pacman --username demo --platform scenario --gameTheme github --scenario checkerboard --output pacman-scenario.svg
```

Use this mode for predefined contribution data, for example demos, screenshots, or local testing. `--scenario` only works with `--platform scenario`; if omitted, the CLI uses `random`. `--username` is still required by the CLI, but in scenario mode it can be any placeholder value because no user data is fetched.

## Integrate into Your GitHub Profile

To showcase the Pac-Man game on your GitHub profile, follow these steps:

1. **Create a Special Repository**:

    - Name a new repository exactly as your GitHub username (e.g., `username/username`).
    - This repository powers your GitHub profile page.

2. **Set Up GitHub Actions**:

    - In the repository, create a `.github/workflows/` directory.
    - Add a `main.yml` file with the following content:

        ```yaml
        name: generate arcade contribution graphs

        on:
            schedule: # Run automatically every 24 hours
                - cron: '0 0 * * *'
            workflow_dispatch: # Allows manual triggering
            push: # Runs on every push to the main branch
                branches:
                    - main

        jobs:
            generate:
                permissions:
                    contents: write
                runs-on: ubuntu-latest
                timeout-minutes: 20

                steps:
                    - name: generate contribution graph SVGs
                      uses: abozanona/pacman-contribution-graph@main
                      with:
                          github_user_name: ${{ github.repository_owner }}
                          # Comma-separated list of game names to generate. Default: pacman
                          games: 'pacman,breakout'
                          # Optional: omit the month labels row above the grid. Default: false
                          hide_month_labels: 'false'

                    # Push the generated SVGs to the output branch
                    - name: push SVGs to the output branch
                      uses: crazy-max/ghaction-github-pages@v3.1.0
                      with:
                          target_branch: output
                          build_dir: dist
                      env:
                          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        ```

3. **Add to Profile README**:

    - In your repository, create or edit the `README.md` file to include. Replace `[USERNAME]` with your GitHub username and `[game-name]` with the game (e.g. `pacman`, `breakout`, …). Repeat the block for each game you enabled.

        ```markdown
        ## My Contribution Graph

        <!-- [game-name] -->
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/[game-name]-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/[game-name]-contribution-graph.svg">
            <img alt="[game-name] contribution graph" src="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/[game-name]-contribution-graph.svg">
        </picture>
        ```

4. **Commit and Push**:
    - Push the changes to GitHub. The GitHub Actions workflow will run daily, updating the Pac-Man game on your profile.

For a detailed guide, refer to the blog post: [Integrate Pac-Man Contribution Graph into Your GitHub Profile](https://abozanona.me/integrate-pacman-contribution-graph-into-github/)

## Integrate into Your GitLab Profile

To showcase the Pac-Man game on your GitLab profile, follow these steps:

1. **Create a Special Repository**:

    - Name a new repository exactly as your GitLab username (e.g., `username/username`).
    - This repository powers your GitLab profile page.

2. **Generate & Setup Push Token**:

    - Open the repository, and from left sidebar navigate to settings => Access Token tab.
    - Generate a new Access Token with the name `CI/CD Push Token` & scope `write_repository`. Access tokens are only valid for 1 year maximum.
    - From left sidebar navigate to settings => CI/CD.
    - In Variables section, add a new variable with the name `CI_PUSH_TOKEN` and the value of the Access Token. Make sure that the variable is `Masked` & `Protect`.

3. **Set Up `gitlab-ci` File**:

    - In the repository, create a `.gitlab-ci.yml` file with the following content.
      Replace `[game-name]` with your chosen game. Add one block per game.

        ```yaml
        stages:
            - generate
            - deploy

        variables:
            GIT_SUBMODULE_STRATEGY: recursive

        generate_graphs:
            stage: generate
            image: node:20
            script:
                - mkdir -p dist
                - npm install -g pacman-contribution-graph
                # Replace [game-name] with the game you want; repeat for each game
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --game [game-name] --gameTheme gitlab --output dist/[game-name]-contribution-graph.svg
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --game [game-name] --gameTheme gitlab-dark --output dist/[game-name]-contribution-graph-dark.svg
            artifacts:
                paths:
                    - dist/*.svg
                expire_in: 1 hour
            rules:
                - if: '$CI_PIPELINE_SOURCE == "schedule"'
                - if: '$CI_PIPELINE_SOURCE == "push"'

        deploy_to_readme:
            stage: deploy
            image: alpine:latest
            script:
                - apk add --no-cache git
                - mkdir -p output
                - cp dist/*.svg output/
                - git remote set-url origin https://gitlab-ci-token:${CI_PUSH_TOKEN}@gitlab.com/${CI_PROJECT_PATH}.git
                - git config --global user.email "arcade-bot@example.com"
                - git config --global user.name "Arcade Bot"
                - git add output/*.svg
                - git commit -m "Update arcade contribution graphs [ci skip]" || echo "No changes"
                - git push origin HEAD:main
            rules:
                - if: '$CI_PIPELINE_SOURCE == "schedule"'
                - if: '$CI_PIPELINE_SOURCE == "push"'
        ```

4. **Add to Profile README**:

    - In your repository, create or edit the `README.md` file to include. Replace `[USERNAME]` with your GitLab username and `[game-name]` with the game. Repeat the block for each game you enabled.

        ```markdown
        ## My Contribution Graph

        <!-- [game-name] -->
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/[game-name]-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/[game-name]-contribution-graph.svg">
            <img alt="[game-name] contribution graph" src="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/[game-name]-contribution-graph.svg">
        </picture>
        ```

5. **Commit and Push**:

    - Push the changes to GitLab. The Gitlab pipeline will work once, updating the Pac-Man game on your profile.

6. **Schedule pipeline running**
    - Go to your project in GitLab
    - In the left sidebar, navigate to Build > Pipeline schedules (sometimes under CI/CD > Schedules)
    - Click New schedule
    - In the form:
        - Interval pattern: Enter a cron expression for daily runs. For example, `0 2 \* \* \*` to run every day at 2:00 AM (UTC).
        - Timezone: Select your preferred timezone.
        - Target branch: Choose the main branch.
    - Click Save pipeline schedule (or Create pipeline schedule).

Your pacman picture will now be generated automatically every day at the same time.

## ⏳ Run the Workflow Manually

Once you have everything set up:

- Go to the "Actions" tab in your repository
- Click "Update Pac-Man Contribution"
- Click "Run workflow" > "Run workflow"

This will start the SVG generation process and you will then be able to see the animation working in your README!
This implementation will allow your Pac-Man contribution graph to be automatically updated every day, keeping it always up to date with your latest contributions.

## 🎯 How it Works

The application uses your GitHub contribution data to:

1. Create a grid where each cell represents a day of contribution
2. Use the contribution intensity levels provided by the GitHub API:

- NONE: Days with no contributions (empty spaces in the game)
- FIRST_QUARTILE: Days with few contributions (small points, 1 point in the game)
- SECOND_QUARTILE: Days with moderate contributions (medium points, 2 points)
- THIRD_QUARTILE: Days with many contributions (large points, 5 points)
- FOURTH_QUARTILE: Days with exceptional contributions (power pellets that activate ghost-eating mode)

These levels are relative to each user's contribution pattern and are automatically calculated by GitHub, so the density of elements in the game will reflect each user's unique profile.

3. Pac-Man navigates the grid using pathfinding algorithms
4. Ghosts chase Pac-Man with unique behaviors (as in the original game)
5. All gameplay is recorded and exported as an animated SVG

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## 🙏 Acknowledgements

Inspired by the [snk](https://github.com/Platane/snk) project, which turns your GitHub contribution graph into a snake game. Special thanks to all contributors and the open-source community for their support.

## 🌐 Online tools that use Pac-Man Contribution Graph Game

- Profile Readme Generator: [Website](https://profile-readme-generator.com/) • [Pull Request](https://github.com/maurodesouza/profile-readme-generator/pull/98)

---

<p align="center">
    These ghosts work hard! Leave a cuddle before you leave.<br>
    <img src="assets/gifs/pink_pet_cafune.gif" alt="Ghost being petted" height="80">
</p>

<!-- MARKDOWN LINKS & IMAGES -->

[active-users-shield]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Felec.abozanona.me%2Fpacman-users-count-shield.php&query=%24.active_users&style=for-the-badge&label=Active%20Users
[contributors-shield]: https://img.shields.io/github/contributors/abozanona/pacman-contribution-graph.svg?style=for-the-badge
[contributors-url]: https://github.com/abozanona/pacman-contribution-graph/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/abozanona/pacman-contribution-graph.svg?style=for-the-badge
[forks-url]: https://github.com/abozanona/pacman-contribution-graph/network/members
[stars-shield]: https://img.shields.io/github/stars/abozanona/pacman-contribution-graph.svg?style=for-the-badge
[stars-url]: https://github.com/abozanona/pacman-contribution-graph/stargazers
[stand-with-palestine-shield]: https://img.shields.io/badge/🇵🇸%20%20Stand%20With%20Palestine-007A3D?style=for-the-badge&logo=liberapay&logoColor=white&labelColor=007A3D
[stand-with-palestine-url]: https://www.islamic-relief.org.uk/giving/appeals/palestine
[buy-me-a-coffee-shield]: https://img.shields.io/badge/Buy%20Me%20a%20Coffee-orange?logo=buy-me-a-coffee&style=for-the-badge
[buy-me-a-coffee-url]: https://www.buymeacoffee.com/abozanona
