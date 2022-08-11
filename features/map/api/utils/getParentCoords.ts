export const getParentCoords = (x: number, y: number) => {
  const tmp = { x, y };
  if (tmp.x < 0) tmp.x--;
  if (tmp.y < 0) tmp.y--;
  tmp.x = Math.floor(tmp.x / 2);
  tmp.y = Math.floor(tmp.y / 2);
  return { x: tmp.x, y: tmp.y };
};
