# 👻 Pac-Man Contribution Graph Game

Transform your GitHub or GitLab contribution graph into an interactive Pac-Man game! This JavaScript library offers a unique and engaging way to visualize your coding activity over the past year.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/pacman-contribution-graph-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/pacman-contribution-graph.svg">
  <img alt="pacman contribution graph" src="https://raw.githubusercontent.com/abozanona/abozanona/output/pacman-contribution-graph.svg">
</picture>

> **Note:**  
> This tool visualizes only your **public contributions** as shown on your GitHub profile.  
> Private contributions are not included due to GitHub's privacy policy.

## 🎮 Features

Elevate your GitHub profile with the Pac-Man Contribution Graph Game and add a playful touch to your coding journey!

- **Contribution Visualization**: Converts your GitHub or GitLab contribution data into a colorful grid.
- **Pac-Man Gameplay**: Classic Pac-Man mechanics where commits are edible dots
- **Multiple Themes**: Choose between different themes, such as GitHub Dark and GitLab Dark.
- **Customizable Settings**: Adjust game speed, sound preferences, and output format (Canvas or SVG).
- **GitHub Integration**: Automatically fetches your contribution data via GraphQL API
- **GitHub Action**: Easy to add to your profile or website README

## 🕹️ Demo

Experience the game firsthand:

**Live Demo**: [Pac-Man Contribution Game](https://abozanona.github.io/pacman-contribution-graph/)

## 🔧 Installation

To integrate the Pac-Man Contribution Graph into your project, you can install it via npm:

```bash
npm install pacman-contribution-graph
```

Alternatively, include it directly in your HTML using jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/pacman-contribution-graph@2.0.0/dist/index.min.js"></script>
```

## 🧩 Usage

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

        ```yaml
        stages:
            - generate
            - deploy

        variables:
            GIT_SUBMODULE_STRATEGY: recursive

        generate_pacman_graph:
            stage: generate
            image: node:20
            script:
                - mkdir -p dist
                - npm install -g pacman-contribution-graph
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --gameTheme gitlab --output pacman-contribution-graph-light.svg
                - mv pacman-contribution-graph-light.svg dist/pacman-contribution-graph-light.svg
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --gameTheme gitlab-dark --output pacman-contribution-graph-dark.svg
                - mv pacman-contribution-graph-dark.svg dist/pacman-contribution-graph-dark.svg
            artifacts:
                paths:
                    - dist/pacman-contribution-graph-light.svg
                    - dist/pacman-contribution-graph-dark.svg
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
                - cp dist/pacman-contribution-graph-light.svg output/
                - cp dist/pacman-contribution-graph-dark.svg output/
                - git remote set-url origin https://gitlab-ci-token:${CI_PUSH_TOKEN}@gitlab.com/${CI_PROJECT_PATH}.git
                - git config --global user.email "pacman-bot@example.com"
                - git config --global user.name "Pacman Bot"
                - git add output/pacman-contribution-graph-light.svg output/pacman-contribution-graph-dark.svg
                - git commit -m "Update Pac-Man contribution graph [ci skip]" || echo "No changes"
                - git push origin HEAD:main
            rules:
                - if: '$CI_PIPELINE_SOURCE == "schedule"'
                - if: '$CI_PIPELINE_SOURCE == "push"'
        ```

4. **Add to Profile README**:
    - In your repository, create or edit the `README.md` file to include:

        ```markdown
        ## My Contribution Graph

        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/pacman-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/pacman-contribution-graph-light.svg">
            <img alt="pacman contribution graph" src="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/pacman-contribution-graph-light.svg">
        </picture>
        ```

5. **Commit and Push**:
    - Push the changes to GitHub. The Gitlab pipeline will work once, updating the Pac-Man game on your profile.

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

## 👻 Ghosts Personalities

Each ghost has been given new looks and personalities that are true to the original game.

|       Ghost        |                                        Preview                                        | Behavior                                                                                                                                                                     |
| :----------------: | :-----------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  **Blinky** (red)  |  <p align="center"><img src="assets/gifs/red_flip.gif" height="40" alt="Blinky"></p>  | An aggressive stalker who targets Pac-Man directly. He gets faster when there are only a few dots left on the map, which players call "Elroy mode".                          |
|  **Pinky** (pink)  |  <p align="center"><img src="assets/gifs/pink_flip.gif" height="40" alt="Pinky"></p>  | Strategist who tries to ambush Pac-Man by positioning himself 4 spaces ahead of his current direction. He specializes in traps and ambushes.                                 |
|  **Inky** (cyan)   |  <p align="center"><img src="assets/gifs/cyan_flip.gif" height="40" alt="Inky"></p>   | Unpredictable and complex. Uses Blinky's position as a reference for his movement, calculating a vector that passes through Pac-Man and then doubling that distance.         |
| **Clyde** (orange) | <p align="center"><img src="assets/gifs/orange_flip.gif" height="40" alt="Clyde"></p> | Shy and erratic. Chases Pac-Man when he is far away, but when he gets closer than 8 spaces away, he runs away to his corner. This "shy" behavior makes him less predictable. |

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
