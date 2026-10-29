// Headings and text that "exist" inside articles, so you can test heading and content search.
export const sampleHeadings = [
    { text: 'What a closure is', path: 'Frontend › JavaScript › Functions › Closures', href: '/frontend/javascript/functions/closures#what-a-closure-is' },
    { text: 'Why it matters', path: 'Frontend › JavaScript › Functions › Closures', href: '/frontend/javascript/functions/closures#why-it-matters' },
    { text: 'Private state', path: 'Frontend › JavaScript › Functions › Closures', href: '/frontend/javascript/functions/closures#private-state' },
    { text: 'A common mistake', path: 'Frontend › JavaScript › Functions › Closures', href: '/frontend/javascript/functions/closures#a-common-mistake' },
    { text: 'Memory and cleanup', path: 'Frontend › JavaScript › Functions › Closures', href: '/frontend/javascript/functions/closures#memory-and-cleanup' },
    { text: 'Array destructuring', path: 'Frontend › JavaScript › Objects › Destructuring', href: '/frontend/javascript/objects/destructuring#array-destructuring' },
    { text: 'Default values', path: 'Frontend › JavaScript › Objects › Destructuring', href: '/frontend/javascript/objects/destructuring#default-values' },
    { text: 'Cleanup functions', path: 'Frontend › React › Hooks › useEffect', href: '/frontend/react/hooks/use-effect#cleanup-functions' },
]

export const sampleContent = [
    { title: 'Closures', path: 'Frontend › JavaScript › Functions', href: '/frontend/javascript/functions/closures', text: 'A closure is a function bundled together with the variables from the scope where it was created. When the function runs later, it can still read and change those variables, even if the outer function has already returned.' },
    { title: 'Closures', path: 'Frontend › JavaScript › Functions', href: '/frontend/javascript/functions/closures', text: 'With var in a loop, every callback shares one variable, so they all see the final value. Using let gives each iteration its own binding.' },
    { title: 'Closures', path: 'Frontend › JavaScript › Functions', href: '/frontend/javascript/functions/closures', text: 'الإغلاق (Closure) هو دالة تحتفظ بالمتغيرات من النطاق الذي أنشئت فيه، حتى بعد انتهاء تنفيذ الدالة الخارجية.' },
    { title: 'Arrow functions', path: 'Frontend › JavaScript › Functions', href: '/frontend/javascript/functions/arrow-functions', text: 'Arrow functions have a shorter syntax and do not have their own this. They take this from the scope around them, which makes them a good fit for callbacks.' },
    { title: 'Destructuring', path: 'Frontend › JavaScript › Objects', href: '/frontend/javascript/objects/destructuring', text: 'Destructuring pulls values out of an object or an array into separate variables. You can rename a property while extracting it, and give it a default value in case it is undefined.' },
    { title: 'Asynchronous code', path: 'Frontend › JavaScript', href: '/frontend/javascript/asynchronous-code', text: 'A promise represents a value that is not ready yet. Use async and await to write code that waits for a promise without nested callbacks.' },
    { title: 'useEffect', path: 'Frontend › React › Hooks', href: '/frontend/react/hooks/use-effect', text: 'useEffect runs after React has rendered. Return a cleanup function to cancel timers, remove listeners or ignore an outdated request.' },
    { title: 'createServer()', path: 'Backend › Node.js › Modules › http', href: '/backend/nodejs/modules/http/create-server', text: 'The createServer function of the http module creates an HTTP server. You pass it a callback that receives every request and response.' },
]