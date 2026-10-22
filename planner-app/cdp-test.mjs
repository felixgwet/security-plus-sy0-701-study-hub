// CDP interaction test for the Sec+ Planner using Node's built-in WebSocket.
const list = await fetch('http://127.0.0.1:9223/json').then((r) => r.json())
const page = list.find((t) => t.type === 'page' && t.url.includes('7100'))
if (!page) throw new Error('page target not found')

const ws = new WebSocket(page.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  }
}
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const mid = ++id
    pending.set(mid, resolve)
    ws.send(JSON.stringify({ id: mid, method, params }))
  })
await new Promise((r) => (ws.onopen = r))

const evalJs = async (expr) => {
  const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })
  if (res.result?.exceptionDetails) throw new Error(JSON.stringify(res.result.exceptionDetails))
  return res.result?.result?.value
}

await send('Page.enable')
await send('Page.reload')
await new Promise((r) => setTimeout(r, 2500))

const results = {}
results.title = await evalJs('document.title')

// 1. Today: check off the study session
results.before = await evalJs(`localStorage.getItem('secplus.state')`)
await evalJs(`[...document.querySelectorAll('button')].find(b => b.textContent.includes('Watch · Introduction'))?.click(); 'clicked'`)
await new Promise((r) => setTimeout(r, 500))
results.afterCheck = await evalJs(`JSON.parse(localStorage.getItem('secplus.state') || '{}').checked`)

// 2. Add a task via input + Add button (React controlled input: use native setter)
await evalJs(`
  const input = document.querySelector('input[placeholder*="task"]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, 'Review flashcards');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Add')?.click();
  'task-added'
`)
await new Promise((r) => setTimeout(r, 500))
results.tasks = await evalJs(`JSON.parse(localStorage.getItem('secplus.state') || '{}').tasks`)

// 3. Switch to Course tab, toggle first video watched
await evalJs(`[...document.querySelectorAll('nav button')].find(b => b.textContent.includes('Course'))?.click(); 'tab'`)
await new Promise((r) => setTimeout(r, 400))
await evalJs(`[...document.querySelectorAll('button')].find(b => b.textContent.includes('Introduction') && b.querySelector('span.rounded-xl'))?.click(); 'expand'`)
await new Promise((r) => setTimeout(r, 400))
results.videos = await evalJs(`document.querySelectorAll('div.divide-y button[aria-label="toggle watched"]').length`)
await evalJs(`document.querySelector('button[aria-label="toggle watched"]')?.click(); 'watched'`)
await new Promise((r) => setTimeout(r, 500))
results.watched = await evalJs(`JSON.parse(localStorage.getItem('secplus.state') || '{}').watched`)
results.header = await evalJs(`document.body.innerText.match(/Security\+ SY0-701.*watched/)?.[0]`)

// 4. Plan tab pace recalculates (watched one 7-min video -> remaining 29h 59m)
await evalJs(`[...document.querySelectorAll('nav button')].find(b => b.textContent.includes('Plan'))?.click(); 'tab2'`)
await new Promise((r) => setTimeout(r, 600))
results.progressText = await evalJs(`document.body.innerText.match(/Course progress[\\s\\S]{0,120}/)?.[0].replace(/\\n/g, ' | ')`)

console.log(JSON.stringify(results, null, 2))
ws.close()
process.exit(0)
