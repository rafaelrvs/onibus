export const urlTSS =
  process.env.NODE_ENV == "development"
    ? "https://converte-textoparaaudio.onrender.com"
    : "https://converte-textoparaaudio.onrender.com";

export const logIn = () => {
  const user = {
    name: "Kleber",
  };

  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
};

export const logOut = () => {
  localStorage.setItem("user", JSON.stringify(null));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
