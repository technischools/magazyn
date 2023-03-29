const { SqlRequest, sql } = require("../lib/database");

module.exports = async function showLoginForm(req, res) {
  if (req.method === "GET") {
    return { title: "Logowanie" };
  }

  if (req.method === "POST") {
    return login(req, res);
  }
};

async function login(req, res) {
  const { login, password } = req.body;

  try {
    const sqlRequest = SqlRequest();

    const result = await sqlRequest
      .input("Login", sql.VarChar(50), login)
      .input("Haslo", sql.VarChar(50), password)
      .query(
        "SELECT Login FROM Uzytkownicy WHERE Login = @Login AND Haslo = @Haslo"
      );

    if (result.rowsAffected[0] === 1) {
      req.session.userLogin = login;
      res.redirectWithMessage("/", `Zalogowany jako ${login}`);
    } else {
      return { title: "Logownie", error: "Logowanie nieudane" };
    }
  } catch (err) {
    console.error(err);
    return { title: "Logownie", error: "Logowanie nieudane" };
  }
}
