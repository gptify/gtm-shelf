const fs = require('fs');
const ucs = JSON.parse(fs.readFileSync('data/use-cases.json', 'utf8'));
console.log('Total use cases:', ucs.length);

const forbiddenTerms = [
  'primary verified stack',
  'tested integrations',
  'verified workflow',
  'verified buyer discounts',
  'guaranteed deliverability',
  'guaranteed pipeline',
  'guaranteed revenue',
  '3-5x',
  '80% match',
  '45% to 80%',
  'tested combination',
  'verified in our active'
];

ucs.forEach((uc, idx) => {
  const str = JSON.stringify(uc).toLowerCase();
  const found = forbiddenTerms.filter(t => str.includes(t));
  const hasDiagram = uc.workflow_diagram && uc.workflow_diagram.length >= 3;
  const hasLean = Boolean(uc.stack_options && uc.stack_options.lean);
  const hasAdvanced = Boolean(uc.stack_options && uc.stack_options.advanced);
  const hasMini = Boolean(uc.mini_preview && uc.mini_preview.length === 3);

  console.log(`[${idx+1}/${ucs.length}] ${uc.slug}: diagram=${hasDiagram} (${uc.workflow_diagram?.length} steps), lean=${hasLean}, advanced=${hasAdvanced}, mini=${hasMini}, forbiddenFound=[${found.join(', ')}]`);
});
