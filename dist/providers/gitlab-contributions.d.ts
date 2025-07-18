import { StoreType } from '../types';
export declare const fetchGitlabContributions: (store: StoreType) => Promise<{
    date: Date;
    count: number;
    color: string;
    level: import("../types").ContributionLevel;
}[]>;
