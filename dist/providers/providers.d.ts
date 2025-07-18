export declare const Providers: {
    fetchGithubContributions: (store: import("../types").StoreType) => Promise<import("../types").Contribution[]>;
    fetchGitlabContributions: (store: import("../types").StoreType) => Promise<{
        date: Date;
        count: number;
        color: string;
        level: import("../types").ContributionLevel;
    }[]>;
};
