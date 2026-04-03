import { supabase } from "../src/db/supabase.js";

async function addPriorityColumn() {
  const { error } = await supabase.rpc("sql", {
    query: `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'products'
            AND column_name = 'priority'
        ) THEN
          ALTER TABLE public.products
          ADD COLUMN priority INTEGER DEFAULT 999;
        END IF;
      END $$;
    `,
  });

  if (error) {
    console.error("❌ Failed:", error);
  } else {
    console.log("✅ Column added (or already exists)");
  }
}

addPriorityColumn();
