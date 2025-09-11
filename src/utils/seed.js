// src/utils/seed.js
import Person from "../models/Person.js";
import { linkSpouses, linkParentChild } from "./relationUtils.js";

export const seedFamily = async () => {
  await Person.deleteMany({});

  const grandad = await Person.create({ name: "Grandad Ram" });
  const wife1 = await Person.create({ name: "Sita" });
  const wife2 = await Person.create({ name: "Gita" });
  const wife3 = await Person.create({ name: "Laxmi" });

  await linkSpouses(grandad._id, wife1._id);
  await linkSpouses(grandad._id, wife2._id);
  await linkSpouses(grandad._id, wife3._id);

  const hari = await Person.create({ name: "Hari" });
  const maya = await Person.create({ name: "Maya" });
  const shyam = await Person.create({ name: "Shyam" });

  await linkParentChild(grandad._id, hari._id);
  await linkParentChild(wife1._id, hari._id);

  await linkParentChild(grandad._id, maya._id);
  await linkParentChild(wife2._id, maya._id);

  await linkParentChild(grandad._id, shyam._id);
  await linkParentChild(wife3._id, shyam._id);

  console.log("✅ Seeded example family (Grandad + 3 wives + children)");
};
