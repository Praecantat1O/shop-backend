export function getItemById(items, id) {
  return items.find(item => item.id === id)
}
