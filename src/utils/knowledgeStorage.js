import storage from './storage';

const KNOWLEDGE_PREFIX = 'knowledge:';

export const getKnowledges = async () => {
  try {
    const keys = await storage.list(KNOWLEDGE_PREFIX);
    if (keys && keys.keys) {
      const knowledges = await Promise.all(
        keys.keys.map(async (key) => {
          try {
            const result = await storage.get(key);
            return result ? JSON.parse(result.value) : null;
          } catch {
            return null;
          }
        })
      );
      return knowledges.filter((knowledge) => knowledge !== null);
    }
    return [];
  } catch {
    return [];
  }
};

export const getKnowledge = async (id) => {
  try {
    const result = await storage.get(`${KNOWLEDGE_PREFIX}${id}`);
    return result ? JSON.parse(result.value) : null;
  } catch {
    return null;
  }
};

export const saveKnowledge = async (knowledge) => {
  const id = knowledge.id || `KNOW${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const newKnowledge = { ...knowledge, id };
  await storage.set(`${KNOWLEDGE_PREFIX}${id}`, JSON.stringify(newKnowledge));
  return newKnowledge;
};

export const deleteKnowledge = async (id) => {
  await storage.delete(`${KNOWLEDGE_PREFIX}${id}`);
};
