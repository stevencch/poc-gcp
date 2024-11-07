/**
 * Determines the execution environment of an app by checking for the presence of Cloud Run environment variables.
 * Cloud Run Service: (`K_SERVICE`, `K_REVISION`, and `K_CONFIGURATION`)
 * Cloud Run Job: (`CLOUD_RUN_JOB`, `CLOUD_RUN_EXECUTION`, `CLOUD_RUN_TASK_INDEX`, `CLOUD_RUN_TASK_ATTEMPT`, and `CLOUD_RUN_TASK_COUNT`)
 *
 * More information on these variables can be found here {@link https://cloud.google.com/run/docs/container-contract#env-vars}
 *
 * @returns {boolean} Returns `true` if running locally, and `false` if running in GCP Cloud Run.
 */
export function isRunningLocally(): boolean {
  const cloudRunEnvVars = [
    'K_SERVICE',
    'K_REVISION',
    'K_CONFIGURATION',
    'CLOUD_RUN_JOB',
    'CLOUD_RUN_EXECUTION',
    'CLOUD_RUN_TASK_INDEX',
    'CLOUD_RUN_TASK_ATTEMPT',
    'CLOUD_RUN_TASK_COUNT',
  ];

  return !Object.keys(process.env).some((key) => cloudRunEnvVars.includes(key));
}
