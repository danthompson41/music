import{s as se,e as M,i as C,y as K,d as b,z as ve,A as be,f as W,l as V,g as k,h as I,m as O,x as T,B as S,n as R,j as P,C as B,D as ie,a as E,E as z,c as A,F,G as ye}from"../chunks/scheduler.1_433SNf.js";import{S as re,i as ce,b as ue,d as ae,m as de,a as U,t as D,c as he,e as _e,g as fe}from"../chunks/index.YR9ItpMM.js";import{w as We}from"../chunks/index.BomQGc-Q.js";function H(n){return n?.length!==void 0?n:Array.from(n)}const x=[["C","B#"],["C#","Db"],["D","D"],["D#","Eb"],["E","Fb"],["F","E#"],["F#","Gb"],["G","G"],["G#","Ab"],["A","A"],["A#","Bb"],["B","Cb"]],ke={Ionian:["W","W","H","W","W","W","H"],Dorian:["W","H","W","W","W","H","W"],Phrygian:["H","W","W","W","H","W","W"],Lydian:["W","W","W","H","W","W","H"],Mixolydian:["W","W","H","W","W","H","W"],Aeolian:["W","H","W","W","H","W","W"],Locrian:["H","W","W","H","W","W","W"]};function pe(n){return x.find(e=>e.includes(n))}function Ne(n,e){console.log("Getting scale for",n,e);const t=pe(n);if(!t)return"Key root not found";const o=[t];for(const l of ke[e]){const c=(x.findIndex(p=>p===o[o.length-1])+(l==="W"?2:1))%12;o.push(x[c])}return console.log(o),o}function q(n,e){const t=pe(n);if(!t)return"Note not found";for(let l=0;l<e.length;l++)if(e[l].includes(t[0])||e[l].includes(t[1]))return String(l+1);let o=x.findIndex(l=>l===t);for(;!e.some(l=>l===x[o])&&o>0;)o-=1;return`b${e.findIndex(l=>l===x[o])+2}`}function Ce(n,e,t){if(console.log("Converting chord to Nashville notation:",t,"in",n,e),!t)return{};const o=Ne(n,e);if(typeof o=="string")return{};const l=q(t.root_note,o);let s;t.bass_note&&(s=q(t.bass_note,o));const c={degree:l,chord_type:t.chord_type,extension:t.extension,bass_note:s,extra:t.extra,chord_id:""};return console.log("Converted Chord:",c),c}function J(n){let e=n.degree,t="";switch(n.chord_type){case"minor":t+="m";break;case"major":t+="maj";break;case"dominant":t+="dom";break;default:t+=n.chord_type}return["1","4","5"].includes(n.degree)&&n.chord_type==="major"&&!n.extension&&(t=""),["2","3","6"].includes(n.degree)&&n.chord_type==="minor"&&!n.extension&&(t=""),n.degree==="7"&&n.chord_type==="dominant"&&!n.extension&&(t=""),e+=t,n.extension&&(e+=n.extension),n.extra&&(e+=n.extra),n.bass_note&&(e+="/"+n.bass_note),e}function ge(n){const t=/^([A-G][#b]?)(maj|min|m|dim|aug|sus|add)?(2|4|6|7|9|11|13)?([^/]*)\/?([A-G][#b]?)?$/.exec(n);if(!t)return null;const[,o,l,s,c,p]=t;let g;return l==="m"||l==="min"?g="minor":l==="maj"||l===void 0&&s===void 0?g="major":l===void 0&&s!==void 0?g="dominant":g=l,{chord_id:"",root_note:o,chord_type:g,extension:s,bass_note:p,extra:c}}console.log(ge("Am7/G"));let L;const we=new Uint8Array(16);function Te(){if(!L&&(L=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!L))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return L(we)}const N=[];for(let n=0;n<256;++n)N.push((n+256).toString(16).slice(1));function Ie(n,e=0){return N[n[e+0]]+N[n[e+1]]+N[n[e+2]]+N[n[e+3]]+"-"+N[n[e+4]]+N[n[e+5]]+"-"+N[n[e+6]]+N[n[e+7]]+"-"+N[n[e+8]]+N[n[e+9]]+"-"+N[n[e+10]]+N[n[e+11]]+N[n[e+12]]+N[n[e+13]]+N[n[e+14]]+N[n[e+15]]}const Se=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),Q={randomUUID:Se};function G(n,e,t){if(Q.randomUUID&&!e&&!n)return Q.randomUUID();n=n||{};const o=n.random||(n.rng||Te)();if(o[6]=o[6]&15|64,o[8]=o[8]&63|128,e){t=t||0;for(let l=0;l<16;++l)e[t+l]=o[l];return e}return Ie(o)}class Ue{key;mode;chord_progression_id;chord_input;derived_chords;derived_nashville_chords;derived_movements;constructor(e,t,o="Ionian"){this.key=t,this.mode=o,this.chord_progression_id=G(),this.chord_input=e.trim(),this.derived_chords=this.splitChordProgression(this.chord_input),this.derived_nashville_chords=this.chordProgressionToNashville(this.derived_chords),this.derived_movements=this.nashvilleChordsToMovement(this.derived_nashville_chords)}chordProgressionToNashville(e){return console.log("Converting chord progression to Nashville notation:",e),e.length===0?[]:e.length===1&&e[0]===null?[]:e.map(t=>Ce(this.key,this.mode,t))}nashvilleChordsToMovement(e){if(console.log("Extracting movements"),e.length<2)return[];let t=[];for(let o=0;o<e.length-1;o++)t.push(this.extract_movement(e[o],e[o+1]));return t}convert_degree_to_number(e){let t=new Map;return t.set("1",0),t.set("b2",1),t.set("2",2),t.set("b3",3),t.set("3",4),t.set("4",5),t.set("b5",6),t.set("5",7),t.set("b6",8),t.set("6",9),t.set("b7",10),t.set("7",11),t.has(e)?t.get(e):-1}convert_number_to_degree(e){return["Unison","Half Step","Second","Minor Third","Major Third","Fourth","Tri-Tone","Fifth","Minor Sixth","Major Sixth","Minor Seventh","Major Seventh"][e%12]}extract_movement(e,t){let o=this.convert_degree_to_number(e.degree),l=this.convert_degree_to_number(t.degree);console.log("From",o,"To",l);let s=0,c=0;o<l?(console.log("From < to"),s=l-o,c=12-s,console.log(s,c)):(console.log("From >= to"),c=o-l,s=12-c,console.log(s,c));let p={root_from:e.degree,root_to:t.degree,delta_up:this.convert_number_to_degree(s),delta_down:this.convert_number_to_degree(c),half_steps_up:s%12,half_steps_down:c%12};return console.log("Chord movement:",p),p}splitChordProgression(e){return console.log("Splitting chord progression:",e),e.split(" ").map(ge)}update(){this.chord_input=this.chord_input.trim(),this.derived_chords=this.splitChordProgression(this.chord_input),this.derived_nashville_chords=this.chordProgressionToNashville(this.derived_chords),this.derived_movements=this.nashvilleChordsToMovement(this.derived_nashville_chords)}}function Ee(n){let e,t,o,l;return{c(){e=W("span"),t=V(n[0])},l(s){e=k(s,"SPAN",{});var c=I(e);t=O(c,n[0]),c.forEach(b)},m(s,c){C(s,e,c),T(e,t),o||(l=S(e,"dblclick",n[6]),o=!0)},p(s,c){c&1&&R(t,s[0])},d(s){s&&b(e),o=!1,l()}}}function Ae(n){let e,t,o;return{c(){e=W("input"),this.h()},l(l){e=k(l,"INPUT",{type:!0,class:!0,placeholder:!0}),this.h()},h(){P(e,"type","text"),P(e,"class","border p-1 rounded"),e.autofocus=!0,P(e,"placeholder","Input here please")},m(l,s){C(l,e,s),B(e,n[0]),e.focus(),t||(o=[S(e,"input",n[5]),S(e,"blur",n[3]),S(e,"keydown",n[4])],t=!0)},p(l,s){s&1&&e.value!==l[0]&&B(e,l[0])},d(l){l&&b(e),t=!1,ie(o)}}}function He(n){let e;function t(s,c){return s[1]?Ae:Ee}let o=t(n),l=o(n);return{c(){l.c(),e=M()},l(s){l.l(s),e=M()},m(s,c){l.m(s,c),C(s,e,c)},p(s,[c]){o===(o=t(s))&&l?l.p(s,c):(l.d(1),l=o(s),l&&(l.c(),l.m(e.parentNode,e)))},i:K,o:K,d(s){s&&b(e),l.d(s)}}}function De(n,e,t){let o,{value:l=""}=e;const s=We(!1);ve(n,s,d=>t(1,o=d));const c=be();function p(){s.set(!1),l.length==0&&t(0,l="-Input here please-"),c("save",l)}function g(d){d.key==="Enter"&&(s.set(!1),l.length==0&&t(0,l="-Input here please-"),c("save",l))}function m(){l=this.value,t(0,l)}const r=()=>s.set(!0);return n.$$set=d=>{"value"in d&&t(0,l=d.value)},[l,o,s,p,g,m,r]}class me extends re{constructor(e){super(),ce(this,e,De,He,se,{value:0})}}function X(n,e,t){const o=n.slice();return o[16]=e[t],o[18]=t,o}function Y(n,e,t){const o=n.slice();return o[19]=e[t],o[20]=e,o[21]=t,o}function Z(n,e,t){const o=n.slice();return o[22]=e[t],o}function $(n,e,t){const o=n.slice();return o[25]=e[t],o[18]=t,o}function ee(n){let e,t,o=n[25].title+"",l,s,c,p;function g(){return n[11](n[18])}return{c(){e=W("li"),t=W("button"),l=V(o),s=E()},l(m){e=k(m,"LI",{});var r=I(e);t=k(r,"BUTTON",{});var d=I(t);l=O(d,o),d.forEach(b),s=A(r),r.forEach(b)},m(m,r){C(m,e,r),T(e,t),T(t,l),T(e,s),c||(p=S(t,"click",g),c=!0)},p(m,r){n=m,r&2&&o!==(o=n[25].title+"")&&R(l,o)},d(m){m&&b(e),c=!1,p()}}}function te(n){let e,t,o,l="Add Section",s,c,p,g,m=H(n[0].sections),r=[];for(let u=0;u<m.length;u+=1)r[u]=le(X(n,m,u));const d=u=>D(r[u],1,1,()=>{r[u]=null});return{c(){e=W("ul"),t=W("li"),o=W("button"),o.textContent=l,s=E();for(let u=0;u<r.length;u+=1)r[u].c()},l(u){e=k(u,"UL",{});var a=I(e);t=k(a,"LI",{});var i=I(t);o=k(i,"BUTTON",{"data-svelte-h":!0}),z(o)!=="svelte-gjbk5o"&&(o.textContent=l),i.forEach(b),s=A(a);for(let f=0;f<r.length;f+=1)r[f].l(a);a.forEach(b)},m(u,a){C(u,e,a),T(e,t),T(t,o),T(e,s);for(let i=0;i<r.length;i+=1)r[i]&&r[i].m(e,null);c=!0,p||(g=S(o,"click",n[6]),p=!0)},p(u,a){if(a&897){m=H(u[0].sections);let i;for(i=0;i<m.length;i+=1){const f=X(u,m,i);r[i]?(r[i].p(f,a),U(r[i],1)):(r[i]=le(f),r[i].c(),U(r[i],1),r[i].m(e,null))}for(fe(),i=m.length;i<r.length;i+=1)d(i);he()}},i(u){if(!c){for(let a=0;a<m.length;a+=1)U(r[a]);c=!0}},o(u){r=r.filter(Boolean);for(let a=0;a<r.length;a+=1)D(r[a]);c=!1},d(u){u&&b(e),F(r,u),p=!1,g()}}}function ne(n){let e,t,o=J(n[22])+"",l;return{c(){e=W("ul"),t=W("li"),l=V(o)},l(s){e=k(s,"UL",{});var c=I(e);t=k(c,"LI",{});var p=I(t);l=O(p,o),p.forEach(b),c.forEach(b)},m(s,c){C(s,e,c),T(e,t),T(t,l)},p(s,c){c&1&&o!==(o=J(s[22])+"")&&R(l,o)},d(s){s&&b(e)}}}function oe(n){let e,t,o,l,s,c,p;function g(){n[14].call(o,n[20],n[21])}let m=H(n[19].derived_nashville_chords),r=[];for(let d=0;d<m.length;d+=1)r[d]=ne(Z(n,m,d));return{c(){e=W("ul"),t=W("li"),o=W("input"),l=E();for(let d=0;d<r.length;d+=1)r[d].c();s=M(),this.h()},l(d){e=k(d,"UL",{});var u=I(e);t=k(u,"LI",{});var a=I(t);o=k(a,"INPUT",{type:!0,class:!0}),a.forEach(b),u.forEach(b),l=A(d);for(let i=0;i<r.length;i+=1)r[i].l(d);s=M(),this.h()},h(){P(o,"type","text"),P(o,"class","svelte-1d5j0f8")},m(d,u){C(d,e,u),T(e,t),T(t,o),B(o,n[19].chord_input),C(d,l,u);for(let a=0;a<r.length;a+=1)r[a]&&r[a].m(d,u);C(d,s,u),c||(p=[S(o,"input",g),S(o,"blur",function(){ye(n[9](n[19].chord_input,n[18],n[21]))&&n[9](n[19].chord_input,n[18],n[21]).apply(this,arguments)})],c=!0)},p(d,u){if(n=d,u&1&&o.value!==n[19].chord_input&&B(o,n[19].chord_input),u&1){m=H(n[19].derived_nashville_chords);let a;for(a=0;a<m.length;a+=1){const i=Z(n,m,a);r[a]?r[a].p(i,u):(r[a]=ne(i),r[a].c(),r[a].m(s.parentNode,s))}for(;a<r.length;a+=1)r[a].d(1);r.length=m.length}},d(d){d&&(b(e),b(l),b(s)),F(r,d),c=!1,ie(p)}}}function le(n){let e,t,o,l,s,c="Add New Progression",p,g,m;function r(...i){return n[13](n[18],...i)}t=new me({props:{value:n[16].name}}),t.$on("save",r);let d=H(n[16].chord_progressions),u=[];for(let i=0;i<d.length;i+=1)u[i]=oe(Y(n,d,i));function a(){return n[15](n[18])}return{c(){e=W("li"),ue(t.$$.fragment),o=E();for(let i=0;i<u.length;i+=1)u[i].c();l=E(),s=W("button"),s.textContent=c},l(i){e=k(i,"LI",{});var f=I(e);ae(t.$$.fragment,f),f.forEach(b),o=A(i);for(let h=0;h<u.length;h+=1)u[h].l(i);l=A(i),s=k(i,"BUTTON",{"data-svelte-h":!0}),z(s)!=="svelte-zv9bok"&&(s.textContent=c)},m(i,f){C(i,e,f),de(t,e,null),C(i,o,f);for(let h=0;h<u.length;h+=1)u[h]&&u[h].m(i,f);C(i,l,f),C(i,s,f),p=!0,g||(m=S(s,"click",a),g=!0)},p(i,f){n=i;const h={};if(f&1&&(h.value=n[16].name),t.$set(h),f&513){d=H(n[16].chord_progressions);let v;for(v=0;v<d.length;v+=1){const w=Y(n,d,v);u[v]?u[v].p(w,f):(u[v]=oe(w),u[v].c(),u[v].m(l.parentNode,l))}for(;v<u.length;v+=1)u[v].d(1);u.length=d.length}},i(i){p||(U(t.$$.fragment,i),p=!0)},o(i){D(t.$$.fragment,i),p=!1},d(i){i&&(b(e),b(o),b(l),b(s)),_e(t),F(u,i),g=!1,m()}}}function xe(n){let e,t,o="Add New Song",l,s,c,p,g,m,r,d,u,a=H(n[1]),i=[];for(let h=0;h<a.length;h+=1)i[h]=ee($(n,a,h));g=new me({props:{value:n[2]}}),g.$on("save",n[12]);let f=n[0]!=null&&te(n);return{c(){e=W("div"),t=W("button"),t.textContent=o,l=E(),s=W("ul");for(let h=0;h<i.length;h+=1)i[h].c();c=E(),p=W("div"),ue(g.$$.fragment),m=E(),f&&f.c()},l(h){e=k(h,"DIV",{});var v=I(e);t=k(v,"BUTTON",{"data-svelte-h":!0}),z(t)!=="svelte-1jengm0"&&(t.textContent=o),l=A(v),s=k(v,"UL",{});var w=I(s);for(let y=0;y<i.length;y+=1)i[y].l(w);w.forEach(b),v.forEach(b),c=A(h),p=k(h,"DIV",{});var _=I(p);ae(g.$$.fragment,_),m=A(_),f&&f.l(_),_.forEach(b)},m(h,v){C(h,e,v),T(e,t),T(e,l),T(e,s);for(let w=0;w<i.length;w+=1)i[w]&&i[w].m(s,null);C(h,c,v),C(h,p,v),de(g,p,null),T(p,m),f&&f.m(p,null),r=!0,d||(u=S(t,"click",n[3]),d=!0)},p(h,[v]){if(v&18){a=H(h[1]);let _;for(_=0;_<a.length;_+=1){const y=$(h,a,_);i[_]?i[_].p(y,v):(i[_]=ee(y),i[_].c(),i[_].m(s,null))}for(;_<i.length;_+=1)i[_].d(1);i.length=a.length}const w={};v&4&&(w.value=h[2]),g.$set(w),h[0]!=null?f?(f.p(h,v),v&1&&U(f,1)):(f=te(h),f.c(),U(f,1),f.m(p,null)):f&&(fe(),D(f,1,1,()=>{f=null}),he())},i(h){r||(U(g.$$.fragment,h),U(f),r=!0)},o(h){D(g.$$.fragment,h),D(f),r=!1},d(h){h&&(b(e),b(c),b(p)),F(i,h),_e(g),f&&f.d(),d=!1,u()}}}function Pe(n,e,t){let o=null,l=null,s=[];async function c(){console.log("New Song");let _={title:"New Song",sections:[],song_id:G()};t(1,s=[...s,_]),console.log(s),t(10,l=s.length-1),t(0,o=s[l]),console.log(l)}async function p(_){console.log("Setting song"),t(10,l=_),t(0,o=s[_]),console.log(o)}let g="";async function m(_){t(2,g=_.detail),o&&t(0,o.title=g,o),console.log(g),console.log(o)}async function r(){console.log("Adding new section");let _={section_id:G(),name:"New Section",chord_progressions:[]};o!=null&&t(0,o.sections=[...o.sections,_],o)}async function d(_,y){let j=_.detail;o&&t(0,o.sections[y].name=j,o),console.log(o?.sections[y])}async function u(_){console.log("Adding new progression");let y=new Ue("C","C");o!=null&&t(0,o.sections[_].chord_progressions=[...o.sections[_].chord_progressions,y],o)}async function a(_,y,j){o&&t(0,o.sections[y].chord_progressions[j].chord_input=_,o),o.sections[y].chord_progressions[j].update(),console.log(o?.sections[y].chord_progressions)}console.log("Updated song index");const i=_=>p(_),f=_=>m(_),h=(_,y)=>d(y,_);function v(_,y){_[y].chord_input=this.value,t(0,o)}const w=_=>u(_);return n.$$.update=()=>{n.$$.dirty&1025&&t(1,s[l]=o,s),n.$$.dirty&1&&o!=null&&t(2,g=o?.title)},[o,s,g,c,p,m,r,d,u,a,l,i,f,h,v,w]}class Be extends re{constructor(e){super(),ce(this,e,Pe,xe,se,{})}}export{Be as component};