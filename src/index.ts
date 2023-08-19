import { execSync } from 'child_process';
import 'dotenv/config'

//Path to the repository
const repoPath = process.env.repoPath;
//Github username
const username = process.env.githubusername;
//Github Personal access token
const token = process.env.token;
//Start date for the contributions
const startDate = new Date('2023-01-01T00:00:00Z').getTime() / 1000;

try {
console.log(repoPath, username, token, startDate);

      const command = `git log --author="${username}" --format="%ct" --since="${startDate}"`;
  const result = execSync(command, { cwd: repoPath, encoding: 'utf-8', env: { GIT_ASKPASS: 'echo', GIT_TOKEN: token } });
  const timestamps = result.trim().split('\n').map(Number);

  if (timestamps.length === 0) {
    console.log('No commits found for the specified username from 2023 onwards.');
    process.exit(1);
  }

  const contributionsByMonth: { [key: string]: number } = {};

  timestamps.forEach((timestamp) => {
    const date = new Date(timestamp * 1000);
    const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

    if (!contributionsByMonth[yearMonth]) {
      contributionsByMonth[yearMonth] = 0;
    }

    contributionsByMonth[yearMonth]++;
  });

  console.log('Contributions breakdown by month:');
  for (const month in contributionsByMonth) {
    console.log(`${month}: ${contributionsByMonth[month]} contributions`);
  }

  const earliestTimestamp = Math.min(...timestamps);
  const latestTimestamp = Math.max(...timestamps);
  const hoursContributed = (latestTimestamp - earliestTimestamp) / 3600;
  console.log(`You contributed approximately ${hoursContributed.toFixed(2)} hours from 2023 onwards.`);
    
} catch (error: unknown) {
    console.error('An error occurred:', (error as Error).message);
}

