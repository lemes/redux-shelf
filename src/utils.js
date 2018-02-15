export function entries(obj = {}) {
  return Object.keys(obj).map((key) => [key, obj[key]]);
}

export function guaranteeArray(param = []) {
  return Array.isArray(param) ? param : [param];
}

export function normalize(payload, key = 'id') {
  return guaranteeArray(payload).reduce(
    (obj, element) => {
      const id = element && element[key];

      if (!id) {
        return obj;
      }

      return {
        ids: [...obj.ids, id],
        content: {
          ...obj.content,
          [id]: element,
        },
      };
    },
    { ids: [], content: {} },
  );
}
