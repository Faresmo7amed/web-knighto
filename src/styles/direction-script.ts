// Runs before first paint to restore the visitor's reading direction without a layout flash.
export const directionScript = `(function(){try{var l=localStorage.getItem('locale');if(l!=='ar'&&l!=='en')l='en';document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr'}catch(e){document.documentElement.lang='en';document.documentElement.dir='ltr'}})()`
