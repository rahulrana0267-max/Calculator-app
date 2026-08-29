// Supabase Configuration
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const display = document.getElementById('display');
const historyList = document.getElementById('history-list');

// App Load hote hi History fetch karein
window.onload = fetchHistory;

function appendValue(val) {
  display.value += val;
}

function clearDisplay() {
  display.value = '';
}

async function calculateResult() {
  const expression = display.value;
  if (!expression) return;

  try {
    const result = eval(expression).toString();
    display.value = result;

    // Supabase mein Save karein
    await saveToSupabase(expression, result);
    fetchHistory();
  } catch (error) {
    display.value = 'Error';
  }
}

// Database Operations
async function saveToSupabase(expression, result) {
  const { error } = await supabaseClient
    .from('calculations')
    .insert([{ expression, result }]);

  if (error) console.error('Save Error:', error);
}

async function fetchHistory() {
  const { data, error } = await supabaseClient
    .from('calculations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Fetch Error:', error);
    return;
  }

  historyList.innerHTML = data
    .map(item => `<li>${item.expression} = <strong>${item.result}</strong></li>`)
    .join('');
}
