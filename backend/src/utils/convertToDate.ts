export function convertToDate(dateString: string) {
  // Define a lista de meses
  const months = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];

  // Quebrar a string no mês e ano
  const [monthStr, yearStr] = dateString.split("/");

  // Encontrar o índice do mês (0-11)
  const monthIndex = months.indexOf(monthStr.toUpperCase());

  // Se o mês não for encontrado, retornar null ou lançar um erro
  if (monthIndex === -1) {
    throw new Error("Formato de mês inválido.");
  }

  // Converter ano para número
  const year = parseInt(yearStr, 10);

  // Retornar o objeto Date
  return new Date(year, monthIndex);
}
