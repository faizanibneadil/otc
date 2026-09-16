import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { Rooms } from './collections/Rooms'
import { Messages } from './collections/Messages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Rooms, Messages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    blocksAsJSON: true,
    pool: {
      connectionString: process.env.NEON_PG,
    },
    readReplicas: [process.env.NEON_REPLICA_1!, process.env.NEON_REPLICA_2!, process.env.NEON_REPLICA_3!]
  }),
  // db: sqliteAdapter({
  //   client: {
  //     url: process.env.DATABASE_URL || '',
  //   },
  // }),
  sharp,
  plugins: [],
})
