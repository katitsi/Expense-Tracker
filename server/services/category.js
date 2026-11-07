import db from "../config/db.js";

let cachedAll = null;
let cachedExpence = null;
let cachedIncome = null;

export const findCategoryById = async (categoryId) => {
  try {
    const [category] = await db.query(
      "SELECT category_id,name,icon,type FROM categories WHERE category_id = ?",
      [categoryId]
    );

    return category[0] || null;
  } catch (err) {
    console.error("findCategoryById error, ", err);
    throw err;
  }
};

export const getCategoriesByType = async (type) => {
  try {
    if (cachedExpence && type === "expense") return cachedExpence;

    if (cachedIncome && type === "income") return cachedIncome;

    const [categories] = await db.query(
      "SELECT category_id,name,type,icon FROM categories WHERE type = ?",
      [type]
    );

    if (type === "expense") cachedExpence = categories;
    else if (type === "income") cachedIncome = categories;

    return categories;
  } catch (err) {
    console.error("findCategoriesByType error ", err);
    throw err;
  }
};

export const getAllCategories = async () => {
  try {
    if (cachedAll) return cachedAll;

    const [categories] = await db.query(
      "SELECT category_id,name,type,icon FROM categories ORDER BY name"
    );

    cachedAll = categories; //save the categories to cache memory

    return categories;
  } catch (err) {
    console.error("findCategoriesByType error ", err);
    throw err;
  }
};
