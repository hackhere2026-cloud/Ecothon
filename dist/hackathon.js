(() => {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
  const tracks = {
    ai:{number:'01',name:'AI with a purpose',category:'APPLIED AI',glyph:'{ai}',title:'Make intelligence\nfeel useful.',description:'Build an AI-powered tool that solves a clear, everyday problem. Help someone learn, work, communicate, or access a service more easily.',prompt:'What could AI help someone do today that they couldn’t do yesterday?',tags:['Useful AI','Human-centered','Responsible design']},
    climate:{number:'02',name:'A more resilient world',category:'LOCAL IMPACT',glyph:'{eco}',title:'Small solutions.\nReal-world impact.',description:'Build for communities, resources, or the environment. Turn a local challenge into a practical tool that people can understand and use.',prompt:'What could your community waste less of, share better, or prepare for sooner?',tags:['Climate','Community','Resilience']},
    experience:{number:'03',name:'Beyond the interface',category:'CREATIVE TECHNOLOGY',glyph:'<ux>',title:'Make technology\nfeel more human.',description:'Explore accessible interfaces, creative tools, and new ways to interact. Put the person at the center of the experience.',prompt:'Who is left out by today’s interfaces, and how could your prototype welcome them in?',tags:['Accessibility','Interaction','Creative tech']},
    open:{number:'04',name:'The wildcard',category:'OPEN INNOVATION',glyph:'[*]',title:'Your strange idea\nbelongs here.',description:'Start with a problem you care about. Make a useful, surprising, or delightful prototype that doesn’t fit neatly into the other tracks.',prompt:'What have you always wanted to build, and what is the smallest version you can show?',tags:['Open ideas','Experimental','Problem-first']}
  };
  const phases = {
    start:{code:'[01]',title:'Find your people.\nFind your problem.',copy:'Get the brief, meet fellow builders, and shape an idea with a team.',items:[['Welcome & kickoff','Meet the event, hear the themes, and understand the build.','OPENING'],['Team formation','Connect complementary skills and find a shared direction.','COLLABORATE'],['Idea checkpoint','Define the problem, user, and first version you can demo.','FOCUS']]},
    build:{code:'[02]',title:'Less overthinking.\nMore prototyping.',copy:'Work through the hard parts, test the core idea, and make progress you can demonstrate.',items:[['Build sprint','Turn your chosen problem into a working prototype.','MAKE'],['Feedback checkpoint','Test the key flow and get a fresh perspective from another team.','ITERATE'],['Demo preparation','Choose the clearest way to show your solution and its value.','REFINE']]},
    show:{code:'[03]',title:'Show the thing.\nTell the story.',copy:'Bring the prototype, explain the choices, and share what you learned.',items:[['Project submission','Package the prototype and explain how to try it.','SUBMIT'],['Demo showcase','Show the user, problem, and working solution.','PRESENT'],['Closing & connections','Reflect on the build and keep the collaborations going.','CONNECT']]}
  };
  let track = 'ai', phase = 'start', draft = null, toastTimer, paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { const saved = localStorage.getItem('ecothon-track') || localStorage.getItem('doddabetta-hacks-track'); if(tracks[saved]) track = saved; } catch {}
  function toast(message){$('.toast').textContent=message;$('.toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('.toast').classList.remove('show'),3500);}
  function selectTrack(key){if(!Object.hasOwn(tracks,key))throw new Error('Choose a valid challenge track.');track=key;const t=tracks[key];$$('.track-card').forEach(b=>{b.classList.toggle('selected',b.dataset.track===key);b.setAttribute('aria-pressed',String(b.dataset.track===key));});$('#track-filename').textContent=`challenge_${t.number}.md`;$('#track-glyph').textContent=t.glyph;$('#track-category').textContent=`TRACK ${t.number} / ${t.category}`;$('#track-title').textContent=t.title;$('#track-description').textContent=t.description;$('#track-prompt').textContent=t.prompt;$('#track-tags').replaceChildren(...t.tags.map(tag=>{const e=document.createElement('span');e.textContent=tag;return e;}));$('#brief-track').value=key;if(!draft)$('#registration-track').value=key;try{localStorage.setItem('ecothon-track',key);}catch{}return {track:key,name:t.name};}
  function selectPhase(key){if(!Object.hasOwn(phases,key))throw new Error('Choose start, build, or show.');phase=key;const p=phases[key];$$('.agenda-tabs button').forEach(b=>{b.classList.toggle('active',b.dataset.phase===key);b.setAttribute('aria-pressed',String(b.dataset.phase===key));});$('#phase-code').textContent=p.code;$('#phase-title').textContent=p.title;$('#phase-copy').textContent=p.copy;$('#agenda-items').replaceChildren(...p.items.map((item,index)=>{const li=document.createElement('li'),num=document.createElement('span'),div=document.createElement('div'),h=document.createElement('h4'),copy=document.createElement('p'),label=document.createElement('small');num.textContent=String(index+1).padStart(2,'0');h.textContent=item[0];copy.textContent=item[1];label.textContent=item[2];div.append(h,copy);li.append(num,div,label);return li;}));return {phase:key,items:p.items.map(i=>i[0]),timings:'To be announced'};}
  $$('.track-card').forEach(b=>b.addEventListener('click',()=>selectTrack(b.dataset.track)));$$('.agenda-tabs button').forEach(b=>b.addEventListener('click',()=>selectPhase(b.dataset.phase)));selectTrack(track);selectPhase(phase);
  function validDraft(value){return value&&typeof value.name==='string'&&value.name.trim().length>0&&value.name.length<=80&&typeof value.email==='string'&&value.email.length<=120&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)&&['developer','designer','student','other'].includes(value.role)&&Object.hasOwn(tracks,value.track)&&value.consent===true;}
  try{const stored=JSON.parse(localStorage.getItem('ecothon-registration') || localStorage.getItem('doddabetta-hacks-registration'));if(validDraft(stored))draft=stored;}catch{}
  function fillDraft(){if(draft){$('#registration-name').value=draft.name;$('#registration-email').value=draft.email;$('#registration-role').value=draft.role;$('#registration-track').value=draft.track;$('#draft-consent').checked=true;$('#draft-actions').hidden=false;$('#registration-message').textContent='Your previous local draft is ready. Official registration is not open yet.';if($('#onpage-name')){$('#onpage-name').value=draft.name;$('#onpage-email').value=draft.email;$('#onpage-role').value=draft.role;$('#onpage-track').value=draft.track;$('#onpage-consent').checked=true;$('#onpage-draft-actions').hidden=false;$('#onpage-message').textContent='Your previous local draft is ready.';}}else{$('#registration-track').value=track;$('#draft-actions').hidden=true;$('#registration-message').textContent='';if($('#onpage-track')){$('#onpage-track').value=track;if($('#onpage-draft-actions'))$('#onpage-draft-actions').hidden=true;if($('#onpage-message'))$('#onpage-message').textContent='';}}}
  function saveDraft(value){if(!validDraft(value))throw new Error('Enter a name and valid email, select a role and track, and confirm this is a local preview.');draft={name:value.name.trim(),email:value.email.trim(),role:value.role,track:value.track,consent:true};let saved=true;try{localStorage.setItem('ecothon-registration',JSON.stringify(draft));}catch{saved=false;}fillDraft();$('#registration-message').textContent=saved?'Draft saved on this device. Nothing was submitted; official registration is coming soon.':'Draft prepared. Your browser could not save it; download a copy instead.';return {savedLocally:saved,submitted:false,track:draft.track};}
  $$('.open-registration').forEach(b=>b.addEventListener('click',()=>{fillDraft();$('#registration').showModal();}));
  $('#registration-form').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;try{saveDraft({name:$('#registration-name').value,email:$('#registration-email').value,role:$('#registration-role').value,track:$('#registration-track').value,consent:$('#draft-consent').checked});}catch(error){$('#registration-message').textContent=error.message;}});
  function download(text,filename){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  function triggerDraftDownload(){if(!draft)return;download(`OOTY HACKS — REGISTRATION DRAFT\n\nName: ${draft.name}\nEmail: ${draft.email}\nRole: ${draft.role}\nInterested track: ${tracks[draft.track].name}\n\nEvent dates: December 19 & 20, 2026\nSetting: Ooty, Tamil Nadu, India\nDuration: 24 Hours Non-Stop\n\nThis is a locally prepared draft, not an official ticket or reserved place.\nOfficial check-in instructions and venue details will be sent to registered builders.\n`, 'ooty-hacks-registration-draft.txt');toast('Your registration draft is ready to download');}
  $('#download-registration').addEventListener('click',triggerDraftDownload);
  $('#clear-registration').addEventListener('click',()=>{draft=null;try{localStorage.removeItem('ecothon-registration');localStorage.removeItem('doddabetta-hacks-registration');}catch{}$('#registration-form').reset();if($('#onpage-register-form'))$('#onpage-register-form').reset();fillDraft();$('#registration-message').textContent='The saved draft has been cleared from this device.';});
  const onpageForm=$('#onpage-register-form');
  if(onpageForm){
    onpageForm.addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;try{saveDraft({name:$('#onpage-name').value,email:$('#onpage-email').value,role:$('#onpage-role').value,track:$('#onpage-track').value,consent:$('#onpage-consent').checked});$('#onpage-form-success').hidden=false;$('#onpage-form-chamber').hidden=true;toast('Your registration draft is saved!');}catch(err){$('#onpage-message').textContent=err.message;}});
    $('#onpage-download-registration')?.addEventListener('click',triggerDraftDownload);
    $('#onpage-clear-registration')?.addEventListener('click',()=>{draft=null;try{localStorage.removeItem('ecothon-registration');localStorage.removeItem('doddabetta-hacks-registration');}catch{}$('#registration-form').reset();onpageForm.reset();fillDraft();toast('Saved draft cleared');});
    $('#onpage-success-download')?.addEventListener('click',triggerDraftDownload);
    $('#onpage-success-reset')?.addEventListener('click',()=>{$('#onpage-form-success').hidden=true;$('#onpage-form-chamber').hidden=false;});
  }
  $('#build-brief').addEventListener('click',()=>{$('#brief-track').value=track;$('#brief').showModal();});
  $('#brief-form').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;const key=$('#brief-track').value,problem=$('#brief-problem').value.trim(),team=$('#brief-team').value.trim()||'Untitled team';if(!problem){$('#brief-problem').setCustomValidity('Describe the problem you want to solve.');$('#brief-problem').reportValidity();return;}download(`OOTY HACKS — FIRST BUILD BRIEF\n\nTeam: ${team}\nChallenge track: ${tracks[key].name}\nEvent dates: December 19 & 20, 2026\nLocation: Ooty, Tamil Nadu (24-Hour Non-Stop Hackathon)\n\nTHE PROBLEM\n${problem}\n\nSTARTING QUESTION\n${tracks[key].prompt}\n\nFIRST THREE TASKS\n1. Choose one user and one useful outcome.\n2. Build the smallest flow that demonstrates it.\n3. Prepare a clear story and a working demo.\n\nDEMO CHECKLIST\n- Explain the user and the problem.\n- Show the core flow working.\n- Discuss limitations and the next iteration.\n\nSummit kickoff: 10:00 IST on December 19, 2026.\n`,'ooty-hacks-build-brief.txt');toast('Your team brief is ready to download');});$('#brief-problem').addEventListener('input',()=>$('#brief-problem').setCustomValidity(''));
  $$('.modal').forEach(d=>{d.querySelector('.modal-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{const r=d.getBoundingClientRect();if(e.target===d&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))d.close();});});
  const mobile=$('.mobile-nav');function closeMenu(){mobile.hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Open navigation');}
  $('.menu-toggle').addEventListener('click',()=>{mobile.hidden=!mobile.hidden;$('.menu-toggle').setAttribute('aria-expanded',String(!mobile.hidden));$('.menu-toggle').setAttribute('aria-label',mobile.hidden?'Open navigation':'Close navigation');});$$('.mobile-nav a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  const hero=$('.hero-shell');let progress=0,target=0,frame=0,mouseX=0;
  function animateHero(){frame=0;progress+=(target-progress)*.11;if(Math.abs(target-progress)<.0004)progress=target;$('.hero-image').style.transform=paused?'':`scale(${1.03+progress*.07}) translateX(${mouseX*.3}%)`;$('.hero-progress i').style.width=`${progress*100}%`;if(target!==progress&&!paused)frame=requestAnimationFrame(animateHero);}
  function scrollUpdate(){target=clamp(-hero.getBoundingClientRect().top/Math.max(1,hero.offsetHeight-innerHeight));$('#nav').classList.toggle('scrolled',scrollY>50);if(!frame)frame=requestAnimationFrame(animateHero);}
  addEventListener('scroll',scrollUpdate,{passive:true});addEventListener('resize',scrollUpdate,{passive:true});$('.hero-stage').addEventListener('pointermove',e=>{if(paused||e.pointerType!=='mouse')return;mouseX=(e.clientX/innerWidth-.5)*1.5;if(!frame)frame=requestAnimationFrame(animateHero);});
  function applyMotion(){document.body.classList.toggle('motion-paused',paused);document.body.classList.toggle('js-motion',!paused);$('#motion-toggle').textContent=paused?'Enable motion':'Pause motion';$('#motion-toggle').setAttribute('aria-pressed',String(paused));if(paused)$$('.reveal').forEach(el=>el.classList.add('visible'));scrollUpdate();}
  $('#motion-toggle').addEventListener('click',()=>{paused=!paused;applyMotion();});matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{paused=e.matches;applyMotion();});applyMotion();
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));}else $$('.reveal').forEach(el=>el.classList.add('visible'));
  $('#start-ascent').addEventListener('click',()=>$('#about').scrollIntoView({behavior:paused?'instant':'smooth'}));

  const sponsorsData = {
    gohub: {
      name: 'go.hub',
      category: 'tech',
      tier: 'PLATINUM PARTNER // DEV & CLOUD',
      title: 'Cloud Infrastructure & Collaborative Dev',
      desc: 'go.hub provides every registered builder at OOTY HACKS with instant-on development environments, containerized workspaces, and high-speed CI/CD runners for peak engineering velocity.',
      perks: [
        '$2,000 in free cloud compute & container credits',
        'Instant staging environments with live URL previews',
        'VIP technical mentorship office hours during the sprint'
      ]
    },
    scidaforest: {
      name: 'scidaforest',
      category: 'tech',
      tier: 'ECOSYSTEM PARTNER // BIO & CLIMATE',
      title: 'Ecological Intelligence & Sensor Networks',
      desc: 'scidaforest equips teams with real-time ecological telemetry, high-resolution satellite forestry datasets, and environmental API keys tailored for local climate resilience and conservation.',
      perks: [
        'Live Bio & Forest telemetry API access with unrestricted keys',
        'Direct sandbox testing on low-power sensor nodes',
        'Special $5,000 Climate Impact Bounty for winning ecological prototype'
      ]
    },
    elrotech: {
      name: 'elro tech',
      category: 'tech',
      tier: 'INNOVATION CATALYST // HARDWARE & EDGE',
      title: 'Edge Neural Acceleration & Micro-Compute',
      desc: 'elro tech delivers ultra-efficient edge computing modules, on-site hardware testing kits, and neural processing units for teams creating real-world physical and embedded intelligence.',
      perks: [
        'On-site hardware loaner kits (neural compute sticks & dev boards)',
        '1-on-1 hardware debugging support from principal engineers',
        'Direct seed sponsorship consideration for outstanding hardware builds'
      ]
    },
    unstop: {
      name: 'unstop',
      category: 'platform',
      tier: 'POWERED BY // TALENT PLATFORM',
      title: 'Global Community & Career Acceleration',
      desc: 'unstop connects the OOTY HACKS hacker community to an expansive global network of tech leaders, high-growth startups, and live venture evaluation channels.',
      perks: [
        'Fast-track hiring profiles pushed directly to premier tech recruiters',
        'Official digital certificates & verified builder credentials',
        'Unstop Pro access & premium interview preparation modules'
      ]
    },
    delyon: {
      name: 'delyon',
      category: 'venture',
      tier: 'LAUNCHPAD PARTNER // SEED VENTURE',
      title: 'Pre-Seed Capital & Strategic Incubation',
      desc: 'delyon accelerates top-tier hackathon projects from 24-hour prototypes into venture-backed companies, offering non-dilutive grant matching and investor syndicate showcases.',
      perks: [
        'Pre-seed grant matching up to $10,000 for top 3 teams',
        'Invitation to closed-door Demo Day with global angel investors',
        '3 months free legal, cloud credits, and incorporation assistance'
      ]
    }
  };

  let activeSponsor = 'gohub';

  function updateSponsorConsole(key) {
    const s = sponsorsData[key];
    if (!s) return;
    activeSponsor = key;

    $$('.sponsor-card').forEach(card => {
      const isSelected = card.dataset.sponsor === key;
      card.classList.toggle('selected', isSelected);
      card.setAttribute('aria-pressed', String(isSelected));
    });

    const brandEl = $('#sponsor-console-brand');
    const tierEl = $('#sponsor-console-tier');
    const titleEl = $('#sponsor-console-title');
    const descEl = $('#sponsor-console-desc');
    const perksEl = $('#sponsor-console-perks');
    const actionBtn = $('#sponsor-action-btn');

    if (brandEl) brandEl.textContent = s.name;
    if (tierEl) tierEl.textContent = s.tier;
    if (titleEl) titleEl.textContent = s.title;
    if (descEl) descEl.textContent = s.desc;
    if (perksEl) {
      perksEl.replaceChildren(...s.perks.map(p => {
        const li = document.createElement('li');
        li.textContent = p;
        return li;
      }));
    }
    if (actionBtn) {
      actionBtn.innerHTML = `Claim ${s.name} Perks <span>➔</span>`;
    }
  }

  $$('.sponsor-card').forEach(card => {
    const key = card.dataset.sponsor;
    card.addEventListener('click', () => updateSponsorConsole(key));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateSponsorConsole(key);
      }
    });
  });

  $$('.sponsor-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      $$('.sponsor-filter').forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });

      let firstVisible = null;
      $$('.sponsor-card').forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.classList.toggle('is-dimmed', !match);
        if (match && !firstVisible) firstVisible = card.dataset.sponsor;
      });

      if (firstVisible && cat !== 'all' && sponsorsData[activeSponsor]?.category !== cat) {
        updateSponsorConsole(firstVisible);
      }
    });
  });

  $('#sponsor-action-btn')?.addEventListener('click', () => {
    const current = sponsorsData[activeSponsor] || { name: 'Partner' };
    toast(`${current.name} perks access requested! Check your registered email for sandbox keys.`);
  });

  // Live Event Countdown for December 19 & 20, 2026
  const EVENT_START_DATE = new Date('2026-12-19T10:00:00+05:30').getTime();

  function updateEventCountdown() {
    const now = Date.now();
    const diff = Math.max(0, EVENT_START_DATE - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const cdDays = $('#cd-days');
    const cdHours = $('#cd-hours');
    const cdMins = $('#cd-mins');
    const cdSecs = $('#cd-secs');

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMins) cdMins.textContent = String(mins).padStart(2, '0');
    if (cdSecs) cdSecs.textContent = String(secs).padStart(2, '0');

    const daysString = String(days);
    if ($('#hero-kicker-days')) $('#hero-kicker-days').textContent = daysString;
    if ($('#hero-cta-days')) $('#hero-cta-days').textContent = daysString;
    if ($('#hero-footer-days')) $('#hero-footer-days').textContent = daysString;

    if (diff === 0 && $('#countdown-status-label')) {
      $('#countdown-status-label').textContent = 'HACKATHON LIVE NOW';
    }
  }

  updateEventCountdown();
  setInterval(updateEventCountdown, 1000);

  if(document.modelContext?.registerTool){const lifecycle=new AbortController();const definitions=[
    {name:'read_hackathon_details',title:'Read hackathon details',description:'Read the event details, selected challenge, schedule, and dates (December 19 & 20, 2026 in Ooty).',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:input=>{if(!input||typeof input!=='object'||Object.keys(input).length)throw new Error('This read tool accepts an empty object only.');const daysLeft=Math.floor(Math.max(0,EVENT_START_DATE-Date.now())/(1000*60*60*24));return {name:'OOTY HACKS',location:'Ooty, Tamil Nadu, India',dates:'December 19–20, 2026',daysLeft:daysLeft,officialRegistrationOpen:false,selectedTrack:track,selectedPhase:phase,tracks:Object.entries(tracks).map(([id,t])=>({id,name:t.name}))};}},
    {name:'select_challenge_track',title:'Select challenge track',description:'Change the visible challenge track and its build-brief starting point.',inputSchema:{type:'object',properties:{track:{type:'string',enum:Object.keys(tracks)}},required:['track'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!input||typeof input.track!=='string')throw new Error('A track is required.');return selectTrack(input.track);}},
    {name:'set_event_phase',title:'Explore event phase',description:'Select the visible draft event phase. Timings are not confirmed.',inputSchema:{type:'object',properties:{phase:{type:'string',enum:Object.keys(phases)}},required:['phase'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!input||typeof input.phase!=='string')throw new Error('A phase is required.');return selectPhase(input.phase);}},
    {name:'save_registration_draft',title:'Save local registration draft',description:'Save a draft on this device only and open the registration preview. Does not submit an application or reserve a place. Requires explicit consent to the local preview.',inputSchema:{type:'object',properties:{name:{type:'string',minLength:1,maxLength:80},email:{type:'string',maxLength:120},role:{type:'string',enum:['developer','designer','student','other']},track:{type:'string',enum:Object.keys(tracks)},consent:{type:'boolean',const:true}},required:['name','email','role','track','consent'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:input=>{const result=saveDraft(input);if(!$('#registration').open)$('#registration').showModal();return result;}}
  ];definitions.forEach(tool=>{try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}});addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
})();
