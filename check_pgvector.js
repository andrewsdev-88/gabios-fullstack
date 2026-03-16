require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Credenciais não encontradas');
  process.exit(1);
}

async function checkPgvector() {
  console.log('🔍 Verificando pgvector...\n');
  
  // Usar a API REST do Supabase para fazer uma query
  // A API REST converte queries SQL em chamadas de função RPC
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/?select=*`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Accept': 'application/json'
        }
      }
    );
    
    // Isso não vai funcionar porque não há tabela vazia
    // Deixa eu tentar uma abordagem diferente
    
    console.log('⚠️  Método REST não aplicável para pg_extension');
    console.log('\n📝 Para verificar pgvector, execute manualmente no Supabase SQL Editor:\n');
    console.log('   SELECT extname FROM pg_extension WHERE extname = \'vector\';\n');
    console.log('Aguardando resultado...\n');
    
  } catch (e) {
    console.error('Erro:', e.message);
  }
}

checkPgvector();
