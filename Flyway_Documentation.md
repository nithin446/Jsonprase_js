# Flyway

All changes made to the database are called migrations. They can be done easily using flyway. It is database version control which makes it simple to regain control over database migrations. Flyway adds a schema history table to the database. It is used to keep track of all the migrations that have already been applied. It gives information on whether the migration was successful or not and the checksum details. Each time a new version is encountered, it is updated in the schema history table.

# How Flyway Works

**Step 1:**
First, flyway tries to locate the schema history table (metadata table). If it is not able to find one, it creates one. Looking at this table can help to identify the state of database.

**Step 2:**
Next, flyway will scan the filesystem or the class path of the application to find the migrations available.

**Step 3:**
These migrations are compared against the metadata table. The versions that are lower than or equal to current version are ignored.

**Step 4:**
All other migrations are marked as pending and they are sorted in order based on the version number and are applied.

**Step 5:**
The metadata table is updated accordingly as each migration is applied.

# Migrations

Migrations can be either versioned or repeatable.

**Versioned migrations**

Each migration will have a version number, description and checksum. The version number given to each migration should be unique. Migrations are applied in the order of version numbers. Generally, the version numbers are in incremental order that conform to a dotted notion or separated by underscores. For flyway to pick a version, it should be defined in the following manner:

**V2\_\_Add\_new\_table.sql**

**V2 -** V is the prefix; 2 is the version number.
**\_\_** is the separator which uses two underscores.
**Add\_new\_table** is the description of the migration script.
**Sql** is the suffix.

The description gives information about that migration. Once the migration of a version is done, a checksum is generated for that migration. This sum changes if any modification is made to the same version after it is loaded into the database to avoid any accidental changes. Each of this migration is applied to the database exactly once and in order. These performs functions like create, alter and insert.

**Undo migration:** These are used to undo the effect of a migration using the same version number. For example: drop table, delete/drop a value from table. These assume that the whole migration is done and should be undone completely.

This does not help with failed versioned migrations on databases without DDL transactions. A migration can fail at any point. If you have 10 statements, it is possible for the 1st, the 5th, the 7th or the 10th to fail. There is simply no way to know in advance. As undo migrations are written to undo an entire versioned migration and will not help under such conditions.

**Repeatable migrations**

These migrations do not have a version number. They just have the description and checksum. These are run and reapplied every time the checksum of a migration changes. These always run last after all the versioned migrations are run. New SQL migrations are picked up automatically by scanning the java class path at runtime that conform to the naming standards below:

**R\_\_Add\_new\_table.sql**

**R -** R is the prefix.
**\_\_** is the separator which uses two underscores.
**Add\_new\_table** is the description of the migration script.
**Sql** is the suffix.

**Migration states**

- When the migration _succeeds_ it is marked as  **success**  in Flyway&#39;s _schema history table_.
- When the migration _fails,_ and the database supports _DDL transactions_, the migration is _rolled back,_ and nothing is recorded in the schema history table.
- When the migration _fails,_ and the database doesn&#39;t support _DDL transactions_, the migration is marked as  **failed**  in the schema history table, indicating manual database cleanup may be required.
- Versioned migrations whose effects have been undone by an undo migration are marked as  **undone**.
- Repeatable migrations whose checksum has changed since they are last applied are marked as  **utdated**  until they are executed again.

# Flyway Setup

**Step 1:**

1. Add the following dependencies to pom.xml:
```xml
<dependency>
     <groupId>mysql</groupId>;
     <artifactId>mysql-connector-java</artifactId>;
</dependency>
<dependency>
     <groupId>org.flywaydb</groupId>;
     <artifactId>flyway-core</artifactId>;
</dependency>
<dependency>
     <groupId>com.h2database</groupId>
     <artifactId>h2<\artifactId>
     <version>1.4.191</version>;
     <scope>runtime</scope>;
</dependency>
```
2. Add the following plugin to pom.xml:
```xml
<plugin>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-maven-plugin</artifactId>
        <version>5.1.4</version>
        <configuration>
        <url>jdbc:h2:file:./target/foobar</url>
        <user>sa</user>
        </configuration>
</plugin>
```
**Step 2: Configuring MySQL and Hibernate**

1. Create a new MySQL database

2. Add the following to the properties.xml file:
```xml
  spring.datasource.url = jdbc:mysql://localhost:3306/project?useSSL=false
  spring.datasource.username = root
  spring.datasource.password = user
  spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.MySQL5InnoDBDialect
  spring.jpa.hibernate.ddl-auto = validate
```
**Step 3: Create a domain entity**

Create an entity for which SQL script is being written.

**Step 4: Creating flyway migration scripts**

The database migration scripts are put in the following directory:  _src/main/resources/db/migration_

Flyway reads those scripts from classpath db/migration by default.

# Useful resources

- https://flywaydb.org/documentation/
- [https://www.thoughts-on-java.org/flyway-getting-started/](https://www.thoughts-on-java.org/flyway-getting-started/)
- https://liucs.net/cs691s16/migrate.html
- https://www.baeldung.com/database-migrations-with-flyway
