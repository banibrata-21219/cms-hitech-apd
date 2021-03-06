# API configuration

Currently, the API is configured entirely with environment variables:

* ### `NODE_ENV`

  * This variable is used to determine which database connection configuration
    to use while the app is running. Knex reads its config information from
    `/api/knexfile.js`, which exports a few different configurations. Knex picks
    the configuration that matches the current `NODE_ENV`.
  * This variable also controls which seed data is applied to the database when
    using the Knex `seed` command.
  * Supported values:
    * `development` - used during development (surprise!). If you're developing
      with Docker, this gets set by the Docker config.
    * `test` - used during testing, eventually. Not used right now.
    * `production` - used in our staging and production environments.
  * **default**: development

* ### `SESSION_SECRET`

  * This is the secret used to sign client authentication cookies. It should be
    cryptographically strong. This secret should be protected.
  * If the secret is changed and the API process restarted, all users will be
    effectively logged out. If the secret is not set and the default value is
    used, users will be logged out every time the process restarts.
  * This value should be at least 256 bits, preferably as a hex string.  If the
    value is a hex string, it will be converted to a byte buffer.  A final secret
    that is below 256 bits will log a warning.
  * **default**: cryptographically-strong random hex string representing a
    512-byte secret

* ### `SESSION_LIFETIME_MINUTES`
  * How long a user may be logged in without logging in again. Currently, any
    user activity involving the API will reset the session expiration to this
    lifetime.  E.g., a user logs in and gets a 2-day session.  If they do
    nothing, they will be logged out in 2 days.  However, if after 1 day they
    load an APD, their session is extended to 2 more days.
  * **default**: 2880 minutes, or 2 days

* ### `PORT`

  * This is the port that the API process should listen on.
  * **default**: 8000

* ### `DATABASE_URL`

  * This variable is only used if `NODE_ENV` is set to `production`.
  * This is the connection URL for the production environment database. In our
    current deployment setup, the cloud provider sets this for us. If it has to
    be set manually, it must be something that the underlying database client
    understands.
  * **default**: none

* ### `DEV_DB_HOST`

  * This variable is only used if `NODE_ENV` is set to `development`.
  * If you are developing the API code and _not_ using Docker, the default
    development database configuration won't work for you because it expects to
    use a database host that is provided by Docker. To get around that, set this
    variable to the hostname of your local PostgreSQL instance.
  * **default**: none

* ### `TEST_DB_HOST`

  * This variable is only used if `NODE_ENV` is set to `test`.
  * If you are running tests and _not_ using Docker, the default test database
    configuration won't work for you because it expects to use a database host
    that is provided by Docker. To get around that, set this variable to the
    hostname of your local PostgreSQL instance.
  * **default**: none

# File/blob store

The API also supports blob storage to different stores, depending on
configuration.  The following environment variables determine which blob store
we use:

* ### `STORE_TYPE`

  * This determines which type of store to use.  For invalid values, we use a
    null store, where writes are ignored and reads return 0 bytes.  
    Valid vlues are:
     * `fs`

* ### `STORE_PATH`

  * This sets the path for the blob store.  For the `fs` store, it's the
    local file path.