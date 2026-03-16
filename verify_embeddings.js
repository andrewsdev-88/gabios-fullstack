require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  console.log('🔍 Verificando se a tabela embeddings existe...\n');
  
  try {
    const { data, error } = await supabase
      .from('embeddings')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('❌ Tabela embeddings NÃO existe');
        console.log('   Erro:', error.message);
        return false;
      }
      console.log('Erro ao consultar:', error);
      return false;
    }
    
    console.log('✅ Tabela embeddings EXISTE e é acessível');
    console.log('   (Isso indica que pgvector provavelmente foi habilitado)');
    return true;
    
  } catch (e) {
    console.error('Erro de conexão:', e.message);
    return false;
  }
}

verify().then(result => {
  process.exit(result ? 0 : 1);
});
