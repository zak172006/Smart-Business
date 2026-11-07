(()=>{
const L=localStorage.getItem("sbLang")||"en";
const AR=L==="ar";
document.documentElement.lang=L;document.documentElement.dir=AR?"rtl":"ltr";
const D={
"Home":"الرئيسية","Orders":"الطلبات","Products":"المنتجات","Customers":"العملاء","Log out":"خروج","Welcome":"أهلاً",
"Get your shop online in 3 easy steps":"جهّز محلك أونلاين في 3 خطوات",
"Add your products (name, price, how many you have)":"أضف منتجاتك (الاسم، السعر، الكمية)",
"Share your menu link with customers":"شارك رابط المنيو مع الزبائن",
"Receive orders here and follow them":"استقبل الطلبات هنا وتابعها",
"Add my first product":"أضف أول منتج","Your online menu":"المنيو الأونلاين بتاعك",
"Customers open this link, choose items and send an order. No account needed.":"الزبون يفتح الرابط، يختار ويبعت طلب. من غير حساب.",
"Share on WhatsApp":"شارك على واتساب","Copy link":"انسخ الرابط","Open menu":"افتح المنيو",
"Order from us here:":"اطلب مننا من هنا:","Link copied":"تم نسخ الرابط","Copy it manually.":"انسخه يدوياً.",
"New orders":"طلبات جديدة","Today's sales":"مبيعات النهارده","Low stock":"مخزون قليل",
"Add a product":"أضف منتج","Product name":"اسم المنتج","Price (EGP)":"السعر (ج.م)","How many?":"الكمية",
"Add":"إضافة","No products yet. Add your first one above.":"لسه مفيش منتجات. أضف أول منتج من فوق.",
"In stock:":"المتوفر:","Edit":"تعديل","Delete":"حذف","Save":"حفظ","Cancel":"إلغاء",
"Edit product":"تعديل المنتج","Name":"الاسم","Price":"السعر","Stock":"الكمية",
"Product added":"تمت إضافة المنتج","Product updated":"تم تعديل المنتج","Product deleted":"تم حذف المنتج",
"Customer deleted":"تم حذف العميل","Order deleted":"تم حذف الطلب","Order created":"تم إنشاء الطلب","Delete this?":"متأكد من الحذف؟",
"No orders yet. Share your menu link to get your first order.":"لسه مفيش طلبات. شارك رابط المنيو عشان تستلم أول طلب.",
"Create an order manually":"اعمل طلب بنفسك","Customer name":"اسم العميل","Choose a product":"اختار منتج",
"Quantity":"الكمية","Create order":"إنشاء الطلب",
"New":"جديد","Pending":"جديد","Processing":"بيتجهز","Preparing":"بيتجهز","Completed":"تم","Done":"تم","Cancelled":"ملغي",
"Choose a product and enter a name.":"اختار منتج واكتب اسم العميل.","Enter a valid quantity.":"اكتب كمية صحيحة.",
"This customer has active orders. Cancel them first.":"العميل ده عنده طلبات شغالة. الغيها الأول.",
"No customers yet. They are added automatically from orders.":"لسه مفيش عملاء. بيتضافوا تلقائياً من الطلبات.",
"Could not save. Check your connection.":"تعذر الحفظ. تأكد من الإنترنت.","Not enough stock to reactivate.":"المخزون مش كفاية.",
"Menu":"المنيو","Loading menu…":"جاري تحميل المنيو…","Choose what you like and send your order.":"اختار اللي يعجبك وابعت طلبك.",
"Nothing is available right now. Please check back soon.":"مفيش حاجة متاحة دلوقتي. جرّب بعدين.",
"This menu link is not valid.":"رابط المنيو غير صحيح.","Your order":"طلبك","Total":"الإجمالي","Your name":"اسمك",
"Phone number":"رقم الموبايل","Delivery address":"عنوان التوصيل","Notes (optional)":"ملاحظات (اختياري)",
"Send order · pay cash on delivery":"ابعت الطلب · الدفع كاش عند الاستلام","Add at least one item.":"أضف منتج واحد على الأقل.",
"Order sent. The shop will contact you on your phone soon.":"تم إرسال الطلب. المحل هيتواصل معاك على الموبايل.",
"Could not send the order. Check your connection and try again.":"تعذر إرسال الطلب. تأكد من الإنترنت وحاول تاني.",
"Welcome back":"أهلاً بعودتك","Log in to your Smart Business account.":"سجّل دخولك إلى حسابك.",
"Email Address":"البريد الإلكتروني","Enter your email":"اكتب بريدك الإلكتروني","Password":"كلمة المرور",
"Enter your password":"اكتب كلمة المرور","Show / Hide Password":"إظهار / إخفاء كلمة المرور","Log in":"دخول",
"Don't have an account?":"معندكش حساب؟","Create account":"إنشاء حساب","← Back to Home":"← الرجوع للرئيسية",
"Join Smart Business and grow your business.":"انضم وطوّر نشاطك.","Full Name":"الاسم بالكامل","Enter your full name":"اكتب اسمك",
"At least 8 characters":"8 حروف على الأقل","Confirm Password":"تأكيد كلمة المرور","Repeat your password":"أعد كتابة كلمة المرور",
"Business Name":"اسم النشاط","Enter your business name":"اكتب اسم نشاطك","Business Type":"نوع النشاط",
"Select your business type":"اختار نوع النشاط","Restaurant":"مطعم","Clothing Store":"محل ملابس",
"Electronics Store":"محل إلكترونيات","Supermarket":"سوبر ماركت","Other Business":"نشاط آخر",
"Create my account":"إنشاء حسابي","Already have an account?":"عندك حساب؟",
"Please complete all fields.":"من فضلك املأ كل الخانات.","Password must contain at least 8 characters.":"كلمة المرور لازم 8 حروف على الأقل.",
"Passwords do not match.":"كلمتا المرور غير متطابقتين.","Incorrect email or password.":"البريد أو كلمة المرور غلط.",
"This email is already registered. Please log in.":"البريد ده مسجل قبل كده. سجّل دخول.",
"Something went wrong. Please try again.":"حصل خطأ. حاول تاني.","Login failed. Please try again.":"فشل الدخول. حاول تاني.",
"Too many attempts. Try again later.":"محاولات كتير. جرّب بعدين.","No connection. Check your internet.":"مفيش اتصال. تأكد من الإنترنت.",
"Services":"الخدمات","Features":"المميزات","About":"عن المنصة","Contact":"تواصل","Login":"دخول","Get Started":"ابدأ الآن",
"SMART BUSINESS PLATFORM":"منصة سمارت بيزنس","Manage Your Business":"أدر نشاطك","The Smart Way":"بالطريقة الذكية",
"One powerful platform to manage your business, products, services and customers easily.":"منصة واحدة لإدارة نشاطك ومنتجاتك وعملائك بسهولة.",
"Start Your Business":"ابدأ نشاطك","Explore Services":"استكشف الخدمات","Explore Our Services":"خدماتنا",
"Everything Your Business Needs In One Place":"كل اللي نشاطك محتاجه في مكان واحد","Restaurants":"المطاعم",
"Clothing Stores":"محلات الملابس","Online Shopping":"التسوق أونلاين",
"Manage restaurant menus, orders and customers easily.":"أدر المنيو والطلبات والعملاء بسهولة.",
"Display clothing products and manage your online store.":"اعرض ملابسك وأدر متجرك أونلاين.",
"Sell products, manage orders and organize your sales.":"بيع منتجاتك ونظّم طلباتك ومبيعاتك.",
"Get Started →":"ابدأ الآن ←","Powerful Business Features":"مميزات قوية",
"Everything you need to control your business from one simple platform.":"كل اللي تحتاجه للتحكم في نشاطك من منصة بسيطة.",
"Business Dashboard":"لوحة التحكم","Track sales, orders and low stock in one place.":"تابع المبيعات والطلبات والمخزون في مكان واحد.",
"Product Management":"إدارة المنتجات","Add, edit and organize your products easily.":"أضف وعدّل ونظّم منتجاتك بسهولة.",
"Customer Management":"إدارة العملاء","Organize customer information and create orders fast.":"نظّم بيانات العملاء وسجّل الطلبات بسرعة.",
"About Smart Business":"عن سمارت بيزنس",
"Smart Business is a multi-activity business management platform designed to help companies, restaurants and online stores manage their operations from one place. Our goal is to make business management easier, faster and smarter.":"سمارت بيزنس منصة لإدارة الأنشطة التجارية، تساعد الشركات والمطاعم والمتاجر على إدارة شغلها من مكان واحد. هدفنا نخلي الإدارة أسهل وأسرع وأذكى.",
"Contact Us":"تواصل معنا","We are here to help your business grow.":"إحنا هنا نساعد نشاطك يكبر.","Contact Our Team":"كلّم فريقنا",
"Smart Business © 2026. All Rights Reserved.":"سمارت بيزنس © 2026. جميع الحقوق محفوظة.",
"Manage Your Business The Smart Way.":"أدر نشاطك بالطريقة الذكية."
};
const P=[[/^Only (\d+) in stock\.$/,"المتاح $1 فقط."],[/^(\d+) left$/,"باقي $1"],[/^(\d+) new online orders?$/,"$1 طلب أونلاين جديد"]];
const N=s=>s.replace(/\s+/g," ").trim();
function tr(s){
  const k=N(s);if(!k)return s;
  if(D[k])return s.replace(/\S[\s\S]*\S|\S/,D[k]);
  for(const[r,v]of P)if(r.test(k))return k.replace(r,v);
  return s.includes("EGP")?s.replace(/EGP/g,"ج.م"):s;
}
window.t=s=>AR?tr(s):s;
if(!AR)var skipAll=true;
function node(n){
  if(n.nodeType===3){const p=n.parentNode&&n.parentNode.nodeName;if(p==="SCRIPT"||p==="STYLE"||p==="TEXTAREA")return;const v=tr(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v;}
  else if(n.nodeType===1){
    if(["SCRIPT","STYLE"].includes(n.nodeName))return;
    ["placeholder","aria-label","title","alt"].forEach(a=>{if(n.hasAttribute&&n.hasAttribute(a)){const v=tr(n.getAttribute(a));if(v!==n.getAttribute(a))n.setAttribute(a,v)}});
    n.childNodes.forEach(node);
  }
}
function start(){
  const b=document.createElement("button");
  b.type="button";b.textContent=AR?"English":"عربي";b.setAttribute("aria-label","Language");
  b.style.cssText="position:fixed;top:10px;inset-inline-end:10px;z-index:99;padding:7px 14px;border-radius:20px;border:1px solid #38bdf8;background:#080d1bcc;color:#fff;font:600 13px system-ui;cursor:pointer;width:auto;height:auto;margin:0";
  b.onclick=()=>{localStorage.setItem("sbLang",AR?"en":"ar");location.reload()};
  document.body.append(b);
  if(!AR)return;
  node(document.body);
  new MutationObserver(m=>m.forEach(x=>{
    if(x.type==="characterData")node(x.target);
    else if(x.type==="attributes")node(x.target);
    else x.addedNodes.forEach(node);
  })).observe(document.body,{childList:true,subtree:true,characterData:true});
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",start):start();
})();
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
