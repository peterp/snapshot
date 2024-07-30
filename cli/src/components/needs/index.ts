import { brotliCliCommand } from './brotliCommand.js'
import { sourceDatabaseUrl, targetDatabaseUrl } from './connectionUrl.js'
import { databaseConnection } from './databaseConnection.js'
import { pgDumpCliCommand } from './pgDumpCliCommand.js'
import { privateKey } from './privateKey.js'
import { publicKey } from './publicKey.js'
import { project } from './project.js'
import { projectId } from './projectId.js'
import { projectPathsV2 } from './projectPaths.js'
import { snapshot } from './snapshot.js'
import { validConnectionString } from './validConnectionString.js'

export const needs = {
  brotliCliCommand,
  sourceDatabaseUrl,
  targetDatabaseUrl,
  databaseConnection,
  pgDumpCliCommand,
  privateKey,
  publicKey,
  project,
  projectId,
  snapshot,
  validConnectionString,
  projectPathsV2,
}