export const log = (message: string) => {
  const loggingDiv = document.getElementById("logging");
  if (loggingDiv) {
    loggingDiv.innerHTML = loggingDiv.innerHTML + `<div>${message}</div>`;
  } else {
    throw new Error("Cannot find the logging div.");
  }
};
