const ADJECTIVES = [
  'Happy', 'Brave', 'Gentle', 'Swift', 'Bright', 'Calm', 'Mighty', 'Wise',
  'Kind', 'Bold', 'Silent', 'Wandering', 'Hidden', 'Golden', 'Silver', 'Quiet',
  'Radiant', 'Fearless', 'Cheerful', 'Mystic', 'Noble', 'Grand', 'Lively',
  'Polite', 'Funny', 'Ocean', 'Forest', 'Mountain', 'Solar', 'Lunar', 'Cosmic',
  'Ancient', 'Modern', 'Stealthy', 'Vibrant', 'Eager', 'Patient', 'Daring'
];

const ANIMALS = [
  'Lion', 'Tiger', 'Eagle', 'Wolf', 'Panda', 'Fox', 'Hawk', 'Dolphin',
  'Deer', 'Bear', 'Owl', 'Cheetah', 'Falcon', 'Rabbit', 'Otter', 'Badger',
  'Koala', 'Penguin', 'Lynx', 'Phoenix', 'Dragon', 'Swan', 'Jaguar',
  'Seal', 'Puffin', 'Turtle', 'Shark', 'Orca', 'Husky', 'Raven', 'Bat',
  'Rhino', 'Sloth', 'Griffin', 'Unicorn', 'Mammoth', 'Leopard', 'Cobra'
];

export function generateRandomName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj} ${animal}`;
}

export function getFlagEmoji(code: string | null): string {
  if (!code) return '🌍';
  return code
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

export function getCountryInitials(name: string | null): string {
  if (!name) return 'GLO';
  if (name.length <= 3) return name.toUpperCase();
  // Get first letter of each word if possible
  const parts = name.split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 3).toUpperCase();
}
