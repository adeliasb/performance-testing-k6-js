// path: utils/helpers.js
// Funções utilitárias para gerar dados aleatórios nos testes

export function randomName() {
  const names = ["Adelia", "João", "Maria", "Carlos"];
  return names[Math.floor(Math.random() * names.length)];
}

export function randomCreditCard() {
  return "4111111111111111"; // Cartão VISA padrão para testes
}
