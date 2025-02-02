import { fetchPrimaryKeys } from './fetchPrimaryKeys.js'
import { createSqliteTestDatabase } from '~/testing/createSqliteDb.js'
import { withDbClient } from '../client.js'

test('should get basics primary keys', async () => {
  const structure = `
  CREATE TABLE "Courses" (
    "CourseID" INTEGER PRIMARY KEY AUTOINCREMENT,
    "CourseName" TEXT NOT NULL
  );
  CREATE TABLE "Students" (
      "StudentID" INTEGER PRIMARY KEY AUTOINCREMENT,
      "FirstName" TEXT NOT NULL,
      "LastName" TEXT NOT NULL
  );
  `
  const connString = await createSqliteTestDatabase(structure)
  const primaryKeys = await withDbClient(fetchPrimaryKeys, {
    connString: connString.toString(),
  })
  expect(primaryKeys).toEqual(
    expect.arrayContaining([
      {
        keys: [{ name: 'CourseID', type: 'INTEGER', affinity: 'integer' }],
        table: 'Courses',
        dirty: false,
        tableId: 'Courses',
      },
      {
        keys: [{ name: 'StudentID', type: 'INTEGER', affinity: 'integer' }],
        table: 'Students',
        dirty: false,
        tableId: 'Students',
      },
    ])
  )
})

test('should get composite primary keys', async () => {
  const structure = `
  CREATE TABLE "Courses" (
    "CourseID" INTEGER PRIMARY KEY AUTOINCREMENT,
    "CourseName" TEXT NOT NULL
  );
  CREATE TABLE "Students" (
      "StudentID" INTEGER PRIMARY KEY AUTOINCREMENT,
      "FirstName" TEXT NOT NULL,
      "LastName" TEXT NOT NULL
  );
  CREATE TABLE "Enrollments" (
      "CourseID" INTEGER NOT NULL,
      "StudentID" INTEGER NOT NULL,
      PRIMARY KEY ("CourseID", "StudentID"),
      FOREIGN KEY ("CourseID") REFERENCES "Courses"("CourseID"),
      FOREIGN KEY ("StudentID") REFERENCES "Students"("StudentID")
  );
  CREATE TABLE "Grades" (
      "CourseID" INTEGER NOT NULL,
      "StudentID" INTEGER NOT NULL,
      "ExamName" TEXT NOT NULL,
      "Grade" REAL NOT NULL,
      PRIMARY KEY ("CourseID", "StudentID", "ExamName"),
      FOREIGN KEY ("CourseID", "StudentID") REFERENCES "Enrollments"("CourseID", "StudentID")
  );
  `
  const connString = await createSqliteTestDatabase(structure)
  const primaryKeys = await withDbClient(fetchPrimaryKeys, {
    connString: connString.toString(),
  })
  expect(primaryKeys).toEqual([
    {
      keys: [{ name: 'CourseID', type: 'INTEGER', affinity: 'integer' }],
      table: 'Courses',
      dirty: false,
      tableId: 'Courses',
    },
    {
      keys: [
        { name: 'CourseID', type: 'INTEGER', affinity: 'integer' },
        { name: 'StudentID', type: 'INTEGER', affinity: 'integer' },
      ],
      table: 'Enrollments',
      dirty: false,
      tableId: 'Enrollments',
    },
    {
      keys: [
        { name: 'CourseID', type: 'INTEGER', affinity: 'integer' },
        { name: 'StudentID', type: 'INTEGER', affinity: 'integer' },
        { name: 'ExamName', type: 'TEXT', affinity: 'text' },
      ],
      table: 'Grades',
      dirty: false,
      tableId: 'Grades',
    },
    {
      keys: [{ name: 'StudentID', type: 'INTEGER', affinity: 'integer' }],
      table: 'Students',
      dirty: false,
      tableId: 'Students',
    },
  ])
})

test('should get rowid for a table without PK', async () => {
  const structure = `
    CREATE TABLE "Courses" (
        "CourseName" VARCHAR(255) NOT NULL
    );
  `
  const connString = await createSqliteTestDatabase(structure)
  const primaryKeys = await withDbClient(fetchPrimaryKeys, {
    connString: connString.toString(),
  })
  expect(primaryKeys).toEqual(
    expect.arrayContaining([
      {
        keys: [{ name: 'rowid', type: 'INTEGER', affinity: 'integer' }],
        table: 'Courses',
        dirty: false,
        tableId: 'Courses',
      },
    ])
  )
})

test('should get the PK column for a table WITHOUT ROWID', async () => {
  const structure = `
    CREATE TABLE "Courses" (
        "CourseID" INT4 PRIMARY KEY,
        "CourseName" VARCHAR(255) NOT NULL
    ) WITHOUT ROWID;
  `
  const connString = await createSqliteTestDatabase(structure)
  const primaryKeys = await withDbClient(fetchPrimaryKeys, {
    connString: connString.toString(),
  })
  expect(primaryKeys).toEqual(
    expect.arrayContaining([
      {
        keys: [{ name: 'CourseID', type: 'INT4', affinity: 'integer' }],
        table: 'Courses',
        dirty: false,
        tableId: 'Courses',
      },
    ])
  )
})

test('should get the PK column for a table with TEXT PRIMARY KEY', async () => {
  const structure = `
    CREATE TABLE "Courses" (
        "CourseID" VARCHAR(255) PRIMARY KEY,
        "CourseName" VARCHAR(255) NOT NULL
    ) WITHOUT ROWID;
  `
  const connString = await createSqliteTestDatabase(structure)
  const primaryKeys = await withDbClient(fetchPrimaryKeys, {
    connString: connString.toString(),
  })
  expect(primaryKeys).toEqual(
    expect.arrayContaining([
      {
        keys: [{ name: 'CourseID', type: 'VARCHAR(255)', affinity: 'text' }],
        table: 'Courses',
        dirty: false,
        tableId: 'Courses',
      },
    ])
  )
})
