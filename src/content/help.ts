export type HelpBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'steps'; items: string[] }
  | { type: 'list'; items: string[] }
  | { type: 'tip'; text: string }

export type HelpArticle = {
  slug: string
  title: string
  category: string
  summary: string
  minutes: number
  body: HelpBlock[]
}

export const HELP_CATEGORIES = [
  { id: 'Getting started', description: 'Set up your workspace and invite your team.' },
  { id: 'Contacts & data', description: 'Import, organize and export your records.' },
  { id: 'Pipeline', description: 'Shape stages around how you sell.' },
  { id: 'Automation', description: 'Let Arbor handle the repetitive steps.' },
]

/** Preview documentation describing the intended product workflows. */
export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: 'setting-up-your-workspace',
    title: 'Setting up your workspace',
    category: 'Getting started',
    summary: 'Name your workspace, choose a currency and set your team’s defaults.',
    minutes: 3,
    body: [
      { type: 'p', text: 'Your workspace holds all of your team’s contacts, companies, deals and settings. Most teams have one; larger organizations can create several.' },
      { type: 'h2', text: 'Configure the basics' },
      { type: 'steps', items: ['Open Settings from the sidebar.', 'Under Workspace, enter a name your team will recognize.', 'Choose the default currency used for deal values.', 'Set your fiscal year start so reports line up with your quarters.'] },
      { type: 'tip', text: 'You can rename the workspace at any time. Changing currency later won’t convert existing deal values.' },
      { type: 'h2', text: 'Next steps' },
      { type: 'list', items: ['Invite teammates so they can start working on deals.', 'Import your existing contacts from a spreadsheet.', 'Adjust your pipeline stages to match your sales process.'] },
    ],
  },
  {
    slug: 'inviting-teammates',
    title: 'Inviting teammates and assigning roles',
    category: 'Getting started',
    summary: 'Add people to your workspace and control what each person can access.',
    minutes: 2,
    body: [
      { type: 'p', text: 'Every person who signs in to Arbor has a role. Roles decide which records someone can see and what they can change.' },
      { type: 'h2', text: 'Send an invitation' },
      { type: 'steps', items: ['Go to Settings → Team.', 'Select Invite people and enter one or more email addresses.', 'Choose a role for the new members.', 'Send the invitation. Invitees receive an email with a link to join.'] },
      { type: 'h2', text: 'Available roles' },
      { type: 'list', items: ['Admin: manages settings, billing and all records.', 'Sales manager: sees and edits the whole team’s pipeline and reports.', 'Account executive: works on their own deals and contacts.'] },
      { type: 'tip', text: 'Start people with the narrowest role they need. You can widen access later in a couple of clicks.' },
    ],
  },
  {
    slug: 'importing-contacts',
    title: 'Importing contacts from a CSV file',
    category: 'Contacts & data',
    summary: 'Bring your existing contacts, companies and deals into Arbor from a spreadsheet.',
    minutes: 4,
    body: [
      { type: 'p', text: 'If your data lives in a spreadsheet or another CRM, export it as a CSV file and import it into Arbor. The importer lets you match each column to the right field before anything is created.' },
      { type: 'h2', text: 'Prepare your file' },
      { type: 'list', items: ['Put one record per row, with column names in the first row.', 'Include an email column for contacts so duplicates can be detected.', 'Keep company names consistent so contacts are linked to the same company.'] },
      { type: 'h2', text: 'Run the import' },
      { type: 'steps', items: ['Open Contacts and choose Import.', 'Upload your CSV file.', 'Match each column to an Arbor field, or skip columns you don’t need.', 'Review the preview, then confirm the import.'] },
      { type: 'tip', text: 'Try importing a small sample of 10–20 rows first to check that your column mapping looks right.' },
    ],
  },
  {
    slug: 'exporting-your-data',
    title: 'Exporting your data',
    category: 'Contacts & data',
    summary: 'Download contacts, companies and deals as CSV files at any time.',
    minutes: 2,
    body: [
      { type: 'p', text: 'Your data belongs to you. Admins can export records from any list view whenever they need a copy.' },
      { type: 'steps', items: ['Open the list you want to export, such as Contacts or Deals.', 'Apply any filters to narrow the records, if needed.', 'Choose Export and select CSV.', 'Your download will start once the file is ready.'] },
      { type: 'tip', text: 'Export permissions can be limited to admins in Settings → Roles.' },
    ],
  },
  {
    slug: 'customizing-pipeline-stages',
    title: 'Customizing pipeline stages',
    category: 'Pipeline',
    summary: 'Rename, reorder and add stages so the board reflects how you really sell.',
    minutes: 3,
    body: [
      { type: 'p', text: 'New workspaces start with a simple pipeline: Discovery, Qualified, Proposal and Closed Won. Most teams adjust it in the first week.' },
      { type: 'h2', text: 'Edit your stages' },
      { type: 'steps', items: ['Open Pipeline and choose Edit stages.', 'Rename a stage by selecting its title.', 'Drag stages to reorder them.', 'Add a stage with the plus button, or archive one you no longer use.'] },
      { type: 'tip', text: 'Keep stages tied to a clear customer action, like “Proposal sent”, so everyone moves deals forward at the same moment.' },
    ],
  },
  {
    slug: 'creating-an-automation',
    title: 'Creating your first automation',
    category: 'Automation',
    summary: 'Build a trigger, condition and action rule to route leads automatically.',
    minutes: 4,
    body: [
      { type: 'p', text: 'Automations follow a simple pattern: when something happens (trigger), check whether it matches (condition), then do something (action).' },
      { type: 'h2', text: 'Example: route larger inbound leads' },
      { type: 'steps', items: ['Open Automations and choose New automation.', 'Pick the trigger “New contact created”.', 'Add the condition “Company size is greater than 50”.', 'Add the action “Assign owner” and choose a teammate or round-robin group.', 'Turn the automation on.'] },
      { type: 'tip', text: 'Give each automation a descriptive name so teammates understand what it does at a glance.' },
    ],
  },
]
