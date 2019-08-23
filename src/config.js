module.exports = {
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    PORT: process.env.PORT || 8000,
    DB_URL: process.env.DB_URL,
    TEST_DB_URL: process.env.TEST_DB_URL,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
}