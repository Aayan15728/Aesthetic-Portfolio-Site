/** Whole years between an ISO birth date (YYYY-MM-DD) and `today`. */
export function ageOn(birthDate: string, today: Date): number {
  const [year, month, day] = birthDate.split("-").map(Number);
  let age = today.getFullYear() - year;
  const hadBirthday = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);
  if (!hadBirthday) age -= 1;
  return age;
}
