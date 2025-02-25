require('dotenv').config({ path: ".env.development" });
const app = require("./app");

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});