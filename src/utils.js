export function entries(obj = {}) {
  return Object.keys(obj).map((key) => [key, obj[key]]);
}

export function normalize(payload, key = 'id') {
  const defaultObj = {
    ids: [],
    content: {},
  };

  if (Array.isArray(payload)) {
    return payload.reduce((obj, element) => {
      const id = element[key];

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
    }, defaultObj);
  }

  if (payload !== null && typeof payload === 'object') {
    const id = payload[key];

    if (id) {
      return {
        ids: [id],
        content: {
          [id]: payload,
        },
      };
    }
  }

  return defaultObj;
}

export default {
  entries,
  normalize,
};
