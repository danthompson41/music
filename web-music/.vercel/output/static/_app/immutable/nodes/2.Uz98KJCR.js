import{s as We,n as ce,r as Ce}from"../chunks/scheduler.k-kUyWhY.js";import{S as Ie,i as ke,g as x,m as R,s as C,e as S,h as W,j as U,n as z,f as p,c as I,y as X,k as d,a as m,x as b,z as D,A as Y,o as ee,B as ie}from"../chunks/index.8oxJKiNT.js";function F(e){return e?.length!==void 0?e:Array.from(e)}const L=[["C","B#"],["C#","Db"],["D","D"],["D#","Eb"],["E","Fb"],["F","E#"],["F#","Gb"],["G","G"],["G#","Ab"],["A","A"],["A#","Bb"],["B","Cb"]],je={Ionian:["W","W","H","W","W","W","H"],Dorian:["W","H","W","W","W","H","W"],Phrygian:["H","W","W","W","H","W","W"],Lydian:["W","W","W","H","W","W","H"],Mixolydian:["W","W","H","W","W","H","W"],Aeolian:["W","H","W","W","H","W","W"],Locrian:["H","W","W","H","W","W","W"]};function be(e){return L.find(t=>t.includes(e))}function Ae(e,t){console.log("Getting scale for",e,t);const n=be(e);if(!n)return"Key root not found";const o=[n];for(const i of je[t]){const c=(L.findIndex(r=>r===o[o.length-1])+(i==="W"?2:1))%12;o.push(L[c])}return console.log(o),o}function he(e,t){const n=be(e);if(!n)return"Note not found";for(let i=0;i<t.length;i++)if(t[i].includes(n[0])||t[i].includes(n[1]))return String(i+1);let o=L.findIndex(i=>i===n);for(;!t.some(i=>i===L[o])&&o>0;)o-=1;return`b${t.findIndex(i=>i===L[o])+2}`}function Ne(e,t,n){if(console.log("Converting chord to Nashville notation:",n,"in",e,t),!n)return{};const o=Ae(e,t);if(typeof o=="string")return{};const i=he(n.root_note,o);let a;n.bass_note&&(a=he(n.bass_note,o));const c={degree:i,chord_type:n.chord_type,extension:n.extension,bass_note:a,extra:n.extra,chord_id:""};return console.log("Converted Chord:",c),c}function de(e){console.log(e);let t=e.degree,n="";switch(e.chord_type){case"minor":n+="m";break;case"major":n+="maj";break;case"dominant":n+="dom";break;default:n+=e.chord_type}return["1","4","5"].includes(e.degree)&&e.chord_type==="major"&&!e.extension&&(n=""),["2","3","6"].includes(e.degree)&&e.chord_type==="minor"&&!e.extension&&(n=""),e.degree==="7"&&e.chord_type==="dominant"&&!e.extension&&(n=""),t+=n,e.extension&&(t+=e.extension),e.extra&&(t+=e.extra),e.bass_note&&(t+="/"+e.bass_note),t}function xe(e){const n=/^([A-G][#b]?)(maj|min|m|dim|aug|sus|add)?(2|4|6|7|9|11|13)?([^/]*)\/?([A-G][#b]?)?$/.exec(e);if(!n)return null;const[,o,i,a,c,r]=n;let s;return i==="m"||i==="min"?s="minor":i==="maj"||i===void 0&&a===void 0?s="major":i===void 0&&a!==void 0?s="dominant":s=i,{chord_id:"",root_note:o,chord_type:s,extension:a,bass_note:r,extra:c}}console.log(xe("Am7/G"));class le{key;mode;chord_progression_id;chord_input;derived_chords;derived_nashville_chords;constructor(t,n,o="Ionian"){this.key=n,this.mode=o,this.chord_progression_id="",this.chord_input=t.trim(),this.derived_chords=this.splitChordProgression(this.chord_input),this.derived_nashville_chords=this.chordProgressionToNashville(this.derived_chords)}chordProgressionToNashville(t){return console.log("Converting chord progression to Nashville notation:",t),t.length===0?[]:t.length===1&&t[0]===null?[]:t.map(n=>Ne(this.key,this.mode,n))}splitChordProgression(t){return console.log("Splitting chord progression:",t),t.split(" ").map(xe)}}let Z;const Ee=new Uint8Array(16);function Pe(){if(!Z&&(Z=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!Z))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return Z(Ee)}const y=[];for(let e=0;e<256;++e)y.push((e+256).toString(16).slice(1));function Ge(e,t=0){return y[e[t+0]]+y[e[t+1]]+y[e[t+2]]+y[e[t+3]]+"-"+y[e[t+4]]+y[e[t+5]]+"-"+y[e[t+6]]+y[e[t+7]]+"-"+y[e[t+8]]+y[e[t+9]]+"-"+y[e[t+10]]+y[e[t+11]]+y[e[t+12]]+y[e[t+13]]+y[e[t+14]]+y[e[t+15]]}const He=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),pe={randomUUID:He};function $(e,t,n){if(pe.randomUUID&&!t&&!e)return pe.randomUUID();e=e||{};const o=e.random||(e.rng||Pe)();if(o[6]=o[6]&15|64,o[8]=o[8]&63|128,t){n=n||0;for(let i=0;i<16;++i)t[n+i]=o[i];return t}return Ge(o)}function _e(e,t,n){const o=e.slice();return o[12]=t[n],o[14]=n,o}function fe(e,t,n){const o=e.slice();return o[15]=t[n],o[17]=n,o}function me(e,t,n){const o=e.slice();return o[18]=t[n],o}function ve(e){let t,n,o=de(e[18])+"",i;return{c(){t=x("p"),n=R("* "),i=R(o)},l(a){t=W(a,"P",{});var c=U(t);n=z(c,"* "),i=z(c,o),c.forEach(p)},m(a,c){m(a,t,c),b(t,n),b(t,i)},p(a,c){c&16&&o!==(o=de(a[18])+"")&&ee(i,o)},d(a){a&&p(t)}}}function ge(e){let t,n=e[15].chord_input+"",o,i,a,c=F(e[15].derived_nashville_chords),r=[];for(let s=0;s<c.length;s+=1)r[s]=ve(me(e,c,s));return{c(){t=x("h3"),o=R(n),i=C();for(let s=0;s<r.length;s+=1)r[s].c();a=S(),this.h()},l(s){t=W(s,"H3",{class:!0});var h=U(t);o=z(h,n),h.forEach(p),i=I(s);for(let l=0;l<r.length;l+=1)r[l].l(s);a=S(),this.h()},h(){d(t,"class","text-xl font-bold")},m(s,h){m(s,t,h),b(t,o),m(s,i,h);for(let l=0;l<r.length;l+=1)r[l]&&r[l].m(s,h);m(s,a,h)},p(s,h){if(h&16&&n!==(n=s[15].chord_input+"")&&ee(o,n),h&16){c=F(s[15].derived_nashville_chords);let l;for(l=0;l<c.length;l+=1){const v=me(s,c,l);r[l]?r[l].p(v,h):(r[l]=ve(v),r[l].c(),r[l].m(a.parentNode,a))}for(;l<r.length;l+=1)r[l].d(1);r.length=c.length}},d(s){s&&(p(t),p(i),p(a)),ie(r,s)}}}function ye(e){let t,n=e[12].name+"",o,i,a,c=F(e[12].chord_progressions),r=[];for(let s=0;s<c.length;s+=1)r[s]=ge(fe(e,c,s));return{c(){t=x("h2"),o=R(n),i=C();for(let s=0;s<r.length;s+=1)r[s].c();a=S(),this.h()},l(s){t=W(s,"H2",{class:!0});var h=U(t);o=z(h,n),h.forEach(p),i=I(s);for(let l=0;l<r.length;l+=1)r[l].l(s);a=S(),this.h()},h(){d(t,"class","text-2xl font-bold")},m(s,h){m(s,t,h),b(t,o),m(s,i,h);for(let l=0;l<r.length;l+=1)r[l]&&r[l].m(s,h);m(s,a,h)},p(s,h){if(h&16&&n!==(n=s[12].name+"")&&ee(o,n),h&16){c=F(s[12].chord_progressions);let l;for(l=0;l<c.length;l+=1){const v=fe(s,c,l);r[l]?r[l].p(v,h):(r[l]=ge(v),r[l].c(),r[l].m(a.parentNode,a))}for(;l<r.length;l+=1)r[l].d(1);r.length=c.length}},d(s){s&&(p(t),p(i),p(a)),ie(r,s)}}}function De(e){let t,n=e[4].title+"",o,i,a,c,r="Key:",s,h,l,v,k,q="Pre-Chorus Progression:",V,j,K,E,G,re="Chorus Progression:",te,A,O,P,H,ue="Outro Progression:",ne,N,M,T,se,ae,w=F(e[4].sections),g=[];for(let u=0;u<w.length;u+=1)g[u]=ye(_e(e,w,u));return{c(){t=x("h1"),o=R(n),i=C(),a=x("div"),c=x("label"),c.textContent=r,s=C(),h=x("input"),l=C(),v=x("div"),k=x("label"),k.textContent=q,V=C(),j=x("input"),K=C(),E=x("div"),G=x("label"),G.textContent=re,te=C(),A=x("input"),O=C(),P=x("div"),H=x("label"),H.textContent=ue,ne=C(),N=x("input"),M=C();for(let u=0;u<g.length;u+=1)g[u].c();T=S(),this.h()},l(u){t=W(u,"H1",{class:!0});var _=U(t);o=z(_,n),_.forEach(p),i=I(u),a=W(u,"DIV",{class:!0});var f=U(a);c=W(f,"LABEL",{for:!0,class:!0,"data-svelte-h":!0}),X(c)!=="svelte-fzjino"&&(c.textContent=r),s=I(f),h=W(f,"INPUT",{type:!0,id:!0,class:!0}),f.forEach(p),l=I(u),v=W(u,"DIV",{class:!0});var B=U(v);k=W(B,"LABEL",{for:!0,class:!0,"data-svelte-h":!0}),X(k)!=="svelte-1vse4tq"&&(k.textContent=q),V=I(B),j=W(B,"INPUT",{type:!0,id:!0,class:!0}),B.forEach(p),K=I(u),E=W(u,"DIV",{class:!0});var J=U(E);G=W(J,"LABEL",{for:!0,class:!0,"data-svelte-h":!0}),X(G)!=="svelte-1iwjgk7"&&(G.textContent=re),te=I(J),A=W(J,"INPUT",{type:!0,id:!0,class:!0}),J.forEach(p),O=I(u),P=W(u,"DIV",{class:!0});var Q=U(P);H=W(Q,"LABEL",{for:!0,class:!0,"data-svelte-h":!0}),X(H)!=="svelte-vurh2t"&&(H.textContent=ue),ne=I(Q),N=W(Q,"INPUT",{type:!0,id:!0,class:!0}),Q.forEach(p),M=I(u);for(let oe=0;oe<g.length;oe+=1)g[oe].l(u);T=S(),this.h()},h(){d(t,"class","text-3xl font-bold"),d(c,"for","keyInput"),d(c,"class","svelte-nkyj50"),d(h,"type","text"),d(h,"id","keyInput"),d(h,"class","svelte-nkyj50"),d(a,"class","input-section svelte-nkyj50"),d(k,"for","preChorus"),d(k,"class","svelte-nkyj50"),d(j,"type","text"),d(j,"id","preChorus"),d(j,"class","svelte-nkyj50"),d(v,"class","input-section svelte-nkyj50"),d(G,"for","chorus"),d(G,"class","svelte-nkyj50"),d(A,"type","text"),d(A,"id","chorus"),d(A,"class","svelte-nkyj50"),d(E,"class","input-section svelte-nkyj50"),d(H,"for","outro"),d(H,"class","svelte-nkyj50"),d(N,"type","text"),d(N,"id","outro"),d(N,"class","svelte-nkyj50"),d(P,"class","input-section svelte-nkyj50")},m(u,_){m(u,t,_),b(t,o),m(u,i,_),m(u,a,_),b(a,c),b(a,s),b(a,h),D(h,e[0]),m(u,l,_),m(u,v,_),b(v,k),b(v,V),b(v,j),D(j,e[1]),m(u,K,_),m(u,E,_),b(E,G),b(E,te),b(E,A),D(A,e[2]),m(u,O,_),m(u,P,_),b(P,H),b(P,ne),b(P,N),D(N,e[3]),m(u,M,_);for(let f=0;f<g.length;f+=1)g[f]&&g[f].m(u,_);m(u,T,_),se||(ae=[Y(h,"input",e[8]),Y(j,"input",e[9]),Y(A,"input",e[10]),Y(N,"input",e[11])],se=!0)},p(u,[_]){if(_&16&&n!==(n=u[4].title+"")&&ee(o,n),_&1&&h.value!==u[0]&&D(h,u[0]),_&2&&j.value!==u[1]&&D(j,u[1]),_&4&&A.value!==u[2]&&D(A,u[2]),_&8&&N.value!==u[3]&&D(N,u[3]),_&16){w=F(u[4].sections);let f;for(f=0;f<w.length;f+=1){const B=_e(u,w,f);g[f]?g[f].p(B,_):(g[f]=ye(B),g[f].c(),g[f].m(T.parentNode,T))}for(;f<g.length;f+=1)g[f].d(1);g.length=w.length}},i:ce,o:ce,d(u){u&&(p(t),p(i),p(a),p(l),p(v),p(K),p(E),p(O),p(P),p(M),p(T)),ie(g,u),se=!1,Ce(ae)}}}function Ue(e,t,n){let o,i,a,c={title:"New Song",sections:[],song_id:$()},r="G",s="Em7 Asus2/F#",h="G G/A B7sus4 Em Gmaj7 A/F# Bm/E Gmaj7/A A/D",l="Em7 Asus/F# G G/A B7sus4 Em Gmaj7 A/F# Bm/E Gmaj7/A A/D G(b5)/Db F#aug";function v(){r=this.value,n(0,r)}function k(){s=this.value,n(1,s)}function q(){h=this.value,n(2,h)}function V(){l=this.value,n(3,l)}return e.$$.update=()=>{e.$$.dirty&3&&n(7,o=new le(s,r,"Ionian")),e.$$.dirty&5&&n(6,i=new le(h,r,"Ionian")),e.$$.dirty&9&&n(5,a=new le(l,r,"Ionian")),e.$$.dirty&224&&n(4,c.sections=[{section_id:$(),name:"Pre-Chorus",chord_progressions:[o]},{section_id:$(),name:"Chorus",chord_progressions:[i]},{section_id:$(),name:"Outro",chord_progressions:[a]}],c)},[r,s,h,l,c,a,i,o,v,k,q,V]}class we extends Ie{constructor(t){super(),ke(this,t,Ue,De,We,{})}}export{we as component};
