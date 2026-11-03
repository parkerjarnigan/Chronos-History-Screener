# Question Bank Transformation & Expansion Plan

Reword existing questions across all 4 units to eliminate verbatim exam text, and add **24 brand-new questions** (6 per unit, evenly distributed as 2 Tier 1, 2 Tier 2, and 2 Tier 3) that assess core standards without duplicating historical exam items.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Summary of User Requirements & Expansion Scope:**
> 1. **Paraphrase Existing Questions**: Reword all current questions so that none match the teacher's classroom unit exams verbatim, while maintaining historical rigor and cognitive skill tags.
> 2. **Generate 24 New Questions (6 Per Unit)**:
>    - **Tier 1 (Recall & Vocabulary)**: 2 questions per unit
>    - **Tier 2 (Conceptual & Cause/Effect)**: 2 questions per unit
>    - **Tier 3 (Analytical & Primary Source)**: 2 questions per unit
> 3. **Curriculum Alignment**: Questions are inspired by 10th-grade World History content standards (not copied from test files).
> 4. **Adaptive Engine & Shuffling**: All questions feature 4 credible options, diagnostic hints, and explanations. Choice positions (A, B, C, D) are dynamically shuffled at runtime to prevent letter bias.

---

### 1. Preview of the 24 New Questions for User Review

Below are the 24 new questions drafted for your review before code insertion into `src/data/questionBank.ts`:

#### UNIT 1: Absolutism, Enlightenment & Revolutions (6 New Questions)

##### Tier 1 (Recall & Core Vocabulary)
1. **ID**: `u1-t1-wollstonecraft`
   - **Skill**: `recall` | **Reading Demand**: `low`
   - **Stem**: Which Enlightenment thinker challenged traditional views on women's education in *A Vindication of the Rights of Woman* (1792)?
   - **Options**:
     - (a) Mary Wollstonecraft
     - (b) Marie Antoinette
     - (c) Catherine the Great
     - (d) Joan of Arc
   - **Correct**: `a`
   - **Hint**: She argued that women only appear inferior to men because they are systematically denied equal schooling.
   - **Explanation**: Mary Wollstonecraft was a pioneering Enlightenment feminist who argued women should receive equal educational opportunities to become rational, autonomous citizens.

2. **ID**: `u1-t1-reign-of-terror`
   - **Skill**: `vocabulary` | **Reading Demand**: `low`
   - **Stem**: During the radical phase of the French Revolution, the Committee of Public Safety used the guillotine to eliminate suspected counter-revolutionaries in a period known as the:
   - **Options**:
     - (a) Reign of Terror
     - (b) Glorious Revolution
     - (c) Tennis Court Oath
     - (d) Congress of Vienna
   - **Correct**: `a`
   - **Hint**: Maximilien Robespierre oversaw this bloody period that resulted in tens of thousands of executions.
   - **Explanation**: The Reign of Terror (1793–1794), led by Robespierre, used state executions to defend the revolution from internal dissent and foreign invasion.

##### Tier 2 (Conceptual & Cause/Effect)
3. **ID**: `u1-t2-rousseau-general-will`
   - **Skill**: `cause_effect` | **Reading Demand**: `medium`
   - **Stem**: In *The Social Contract*, Jean-Jacques Rousseau argued that legitimate political governance must reflect the "General Will." What did this concept imply for society?
   - **Options**:
     - (a) Community decisions must serve the common good of all citizens rather than the selfish desires of elite individuals
     - (b) A monarch must always follow the decrees of the Pope
     - (c) Citizens must surrender all personal liberties to a hereditary military ruler
     - (d) Property owners should have ten times as many votes as agricultural laborers
   - **Correct**: `a`
   - **Hint**: Rousseau believed that true freedom came from collective alignment with what benefits the whole community.
   - **Explanation**: Rousseau's "General Will" prioritized the collective civic good over private individual interests, laying the ideological foundation for direct popular sovereignty.

4. **ID**: `u1-t2-bolivar-enlightenment`
   - **Skill**: `cause_effect` | **Reading Demand**: `medium`
   - **Stem**: How did European Enlightenment philosophies and the Napoleonic Wars influence the Latin American independence movements led by figures like Simón Bolívar?
   - **Options**:
     - (a) Creoles drew on ideas of popular sovereignty and took advantage of Spain's political distraction under French occupation to revolt
     - (b) Latin American colonies voted to join the British Empire for financial stability
     - (c) Native indigenous leaders petitioned the French King to annex South America
     - (d) Napoleon sent French armies to liberate Spanish colonies and establish local democracies
   - **Correct**: `a`
   - **Hint**: When Napoleon invaded Spain in 1808 and dethroned King Ferdinand VII, Spanish American colonials questioned their loyalty to a foreign puppet king.
   - **Explanation**: Educated Creoles embraced Enlightenment concepts of natural rights and self-government; when Napoleon deposed the Spanish monarch, revolutionary leaders seized the moment to fight for independence.

##### Tier 3 (Analytical & Primary Source Analysis)
5. **ID**: `u1-t3-declaration-rights-man`
   - **Skill**: `source_analysis` | **Reading Demand**: `high`
   - **Stem**: Read this excerpt from the *Declaration of the Rights of Man and of the Citizen* (1789). Which fundamental political shift does Article 3 represent?
   - **Excerpt**: *"Article 3: The principle of all sovereignty resides essentially in the nation. No body nor individual may exercise any authority which does not proceed directly from the nation."*
   - **Options**:
     - (a) Legitimate political authority originates with the people rather than with a monarch appointed by God
     - (b) The Roman Catholic Church retains final veto power over national taxation
     - (c) French citizens must swear personal loyalty oaths to the royal Habsburg lineage
     - (d) Military generals are designated as the sole lawmakers during peacetime
   - **Correct**: `a`
   - **Hint**: Notice where power "resides"—in "the nation" (the citizens), not in a royal crown or divine lineage.
   - **Explanation**: Article 3 stripped the Bourbon monarchy of sovereign divine right and invested supreme political authority directly in the collective body of citizens (popular sovereignty).

6. **ID**: `u1-t3-rev-comparison`
   - **Skill**: `source_analysis` | **Reading Demand**: `high`
   - **Stem**: When comparing the outcomes of the American Revolution (1776) and the French Revolution (1789), what key structural difference emerged by the early 1800s?
   - **Options**:
     - (a) The American Revolution produced a enduring constitutional republic, whereas the French Revolution cycled through extreme radicalism and ended in a military dictatorship under Napoleon
     - (b) The American Revolution abolished all private property, while France maintained feudal serfdom
     - (c) France successfully maintained an absolute monarchy, while the United States established a hereditary nobility
     - (d) Both revolutions ended in immediate permanent peace and disarmament across the Western Hemisphere
   - **Correct**: `a`
   - **Hint**: Think about the political roller coaster in France (King ➔ Republic ➔ Reign of Terror ➔ Directory ➔ Emperor).
   - **Explanation**: While the American Revolution established a relatively stable constitutional federal republic, France experienced deep social upheaval, violent radicalization, and ultimately consolidated power under Napoleon Bonaparte.

---

#### UNIT 2: Industrial Revolution & Social Impact (6 New Questions)

##### Tier 1 (Recall & Core Vocabulary)
7. **ID**: `u2-t1-enclosure-movement`
   - **Skill**: `recall` | **Reading Demand**: `low`
   - **Stem**: In 18th-century Britain, wealthy landowners consolidated and fenced off shared village pastureland, forcing millions of displaced farmers to migrate to factory cities. What was this process called?
   - **Options**:
     - (a) The Enclosure Movement
     - (b) The Great Migration
     - (c) The Agricultural Embargo
     - (d) The Feudal Restoration
   - **Correct**: `a`
   - **Hint**: Landowners literally "enclosed" open common fields with hedges, fences, and stone walls.
   - **Explanation**: The Enclosure Acts fenced off common agricultural land, increasing farming efficiency for wealthy owners while creating an immense urban labor supply for emerging textile mills.

8. **ID**: `u2-t1-cottage-industry`
   - **Skill**: `vocabulary` | **Reading Demand**: `low`
   - **Stem**: Before steam-powered factories, goods like wool cloth and iron nails were manufactured by hand in workers' rural homes in a decentralized system known as:
   - **Options**:
     - (a) The Cottage Industry (Domestic System)
     - (b) The Assembly Line System
     - (c) Mass Industrial Production
     - (d) Corporate Conglomerates
   - **Correct**: `a`
   - **Hint**: Think of production taking place inside small village cottages rather than vast urban complexes.
   - **Explanation**: The cottage industry (or putting-out system) involved merchants delivering raw wool or cotton to families who spun and wove textiles at home before machines centralized labor under factory roofs.

##### Tier 2 (Conceptual & Cause/Effect)
9. **ID**: `u2-t2-middle-class-growth`
   - **Skill**: `cause_effect` | **Reading Demand**: `medium`
   - **Stem**: How did the Industrial Revolution fundamentally transform European social class structure during the 19th century?
   - **Options**:
     - (a) It expanded a wealthy and influential middle class (bourgeoisie) of factory owners, bankers, and professionals alongside a growing urban working class (proletariat)
     - (b) It completely eliminated economic differences between factory owners and floor workers
     - (c) It forced all noble aristocrats to give up their estates and work in coal mines
     - (d) It reduced urban populations and returned European society to medieval farming communes
   - **Correct**: `a`
   - **Hint**: A new social stratum formed between landed aristocrats and impoverished manual laborers.
   - **Explanation**: Industrial capitalism created a powerful industrial bourgeoisie (investors, entrepreneurs, managers) who gained political influence, while creating a distinct factory wage-earning proletariat.

10. **ID**: `u2-t2-urban-environment-pollution`
    - **Skill**: `cause_effect` | **Reading Demand**: `medium`
    - **Stem**: What was a major environmental and public health consequence of the rapid, unregulated growth of British manufacturing hubs like Manchester in the early 1800s?
    - **Options**:
      - (a) Toxic coal smoke polluted city air, while untreated sewage in rivers caused frequent deadly outbreaks of waterborne diseases like cholera
      - (b) Agricultural crops suffered from severe shortages of water due to desalinization plants
      - (c) Cities became completely self-sustaining green spaces with strict mandatory recycling laws
      - (d) Industrial waste was cleanly transported into outer space using early steam conduits
    - **Correct**: `a`
    - **Hint**: Without municipal sewers, clean tap water, or clean air laws, industrial city life expectancy plummeted.
    - **Explanation**: Rapid urbanization overwhelmed basic municipal infrastructure, creating filthy tenement districts where coal soot and contaminated water supplies led to catastrophic cholera epidemics.

##### Tier 3 (Analytical & Primary Source Analysis)
11. **ID**: `u2-t3-child-labor-testimony`
    - **Skill**: `source_analysis` | **Reading Demand**: `high`
    - **Stem**: Read this testimony given before the British Parliamentary Sadler Committee in 1832. What primary workplace reality does Elizabeth Bentley describe?
    - **Excerpt**: *"Q: What time did you begin work at the flax-mill? A: When I was eight years old. Q: What were your hours of labor? A: From 5 in the morning to 9 at night. Q: What time was allowed for meals? A: Forty minutes at noon. Q: Had you time to eat breakfast or afternoon refreshment? A: No, we had to eat it as we could, while working on our feet, or let it alone."*
    - **Options**:
      - (a) Child laborers endured punishing 16-hour shifts with virtually no meal breaks under hazardous, relentless working conditions
      - (b) Mill owners provided on-site tutoring and high wages for young apprentices
      - (c) Children were strictly limited to two hours of light clerical work each afternoon
      - (d) Factory workers preferred manufacturing shifts because farm work was far more physically exhausting
    - **Correct**: `a`
    - **Hint**: Look at the working hours: from 5:00 AM to 9:00 PM without even sitting down for meals.
    - **Explanation**: The Sadler Committee hearings documented severe exploitation of young children in textile mills, directly prompting Parliament to pass the Factory Act of 1833 to restrict child labor hours.

12. **ID**: `u2-t3-owen-utopian-socialism`
    - **Skill**: `source_analysis` | **Reading Demand**: `high`
    - **Stem**: Factory reformer Robert Owen attempted to combat the harsh realities of industrial capitalism by creating model communities (such as New Lanark in Scotland). What philosophy guided his efforts?
    - **Options**:
      - (a) Utopian Socialism: the belief that humane working conditions, decent housing, and free schooling for children would foster a cooperative and productive society
      - (b) Social Darwinism: the belief that only the strongest workers should receive food rations
      - (c) Absolute Laissez-Faire: the belief that government and business owners should never regulate workplace hours
      - (d) Mercantilism: the belief that colonies should be conquered exclusively to supply slave labor for mills
    - **Correct**: `a`
    - **Hint**: Owen believed human character was formed by environment; changing the living environment would eliminate crime and misery.
    - **Explanation**: Robert Owen was an early Utopian Socialist who demonstrated that factory owners could treat workers humanely—providing clean homes, fair hours, and schools—while still remaining profitable.

---

#### UNIT 3: World War I & Global Imperialism (6 New Questions)

##### Tier 1 (Recall & Core Vocabulary)
13. **ID**: `u3-t1-schlieffen-plan`
    - **Skill**: `recall` | **Reading Demand**: `low`
    - **Stem**: What was the primary objective of Germany's military blueprint known as the "Schlieffen Plan" at the beginning of World War I?
    - **Options**:
     - (a) To rapidly invade and knock France out of the war by marching through neutral Belgium, then pivot eastward to confront Russia
     - (b) To sign an immediate permanent peace treaty with Great Britain
     - (c) To construct an impenetrable concrete defensive wall along the Russian border
     - (d) To transport Germany's entire army across the Atlantic Ocean to invade Canada
    - **Correct**: `a`
    - **Hint**: Germany wanted to avoid a prolonged two-front war by defeating France within six weeks before slow-moving Russia could mobilize.
    - **Explanation**: The Schlieffen Plan assumed Russia would take six weeks to mobilize; Germany planned to sweep through neutral Belgium to encircle Paris quickly, but Belgian resistance and British entry halted their advance.

14. **ID**: `u3-t1-armenian-genocide`
    - **Skill**: `vocabulary` | **Reading Demand**: `low`
    - **Stem**: During World War I, the Ottoman imperial government carried out systematic forced deportations, starvation marches, and massacres against which minority Christian ethnic group?
    - **Options**:
     - (a) The Armenians
     - (b) The Vikings
     - (c) The Normans
     - (d) The Boers
    - **Correct**: `a`
    - **Hint**: An estimated 1 to 1.5 million people of this ethnic heritage perished in the Ottoman Empire between 1915 and 1917.
    - **Explanation**: Fearing Armenian collaboration with invading Russian forces, Ottoman authorities orchestrated the Armenian Genocide, resulting in mass executions and deadly death marches across the Syrian desert.

##### Tier 2 (Conceptual & Cause/Effect)
15. **ID**: `u3-t2-total-war-home-front`
    - **Skill**: `cause_effect` | **Reading Demand**: `medium`
    - **Stem**: Why is World War I described by modern historians as a "Total War"?
    - **Options**:
     - (a) Combatant nations mobilized all domestic economic resources, civilian labor, and food supplies to support the war effort while civilian targets faced military attack
     - (b) Only professional soldiers were allowed to participate, leaving the civilian economy untouched
     - (c) War was declared between every single country on Earth simultaneously
     - (d) Military leaders banned all newspapers, radio broadcasts, and industrial factories
    - **Correct**: `a`
    - **Hint**: The entire society—factories, housewives rationing sugar, bond drives, and women building artillery shells—was harnessed for victory.
    - **Explanation**: "Total War" blurred the line between battlefield and civilian home front: governments took control of industries, instituted conscription, rationed food, and directed state propaganda to sustain war.

16. **ID**: `u3-t2-mandate-system-mideast`
    - **Skill**: `cause_effect` | **Reading Demand**: `medium`
    - **Stem**: Following the collapse of the Ottoman Empire after WWI, the League of Nations established the "Mandate System" in the Middle East. What was the practical reality of this system?
    - **Options**:
     - (a) Britain and France took imperial administrative control of territories like Iraq, Syria, and Palestine despite promising self-rule to Arab nationalists
     - (b) All Middle Eastern states were granted immediate independence and equal seats in the League of Nations
     - (c) The region was placed under the permanent military supervision of the United States
     - (d) European powers completely withdrew all troops and economic investments from the region
    - **Correct**: `a`
    - **Hint**: European powers treated these "mandates" essentially as colonies under a different diplomatic label.
    - **Explanation**: The Mandate System divided former Ottoman lands between Britain and France (formalizing the wartime Sykes-Picot Agreement), reneging on British promises of Arab independence and sowing long-term regional instability.

##### Tier 3 (Analytical & Primary Source Analysis)
17. **ID**: `u3-t3-wilfred-owen-poetry`
    - **Skill**: `source_analysis` | **Reading Demand**: `high`
    - **Stem**: Read these lines from British soldier Wilfred Owen's 1917 poem *Dulce et Decorum Est*. What was Owen's central message about the nature of warfare?
    - **Excerpt**: *"Gas! GAS! Quick, boys!—An ecstasy of fumbling, / Fitting the clumsy helmets just in time... / If you could hear, at every jolt, the blood / Come gargling from the froth-corrupted lungs... / My friend, you would not tell with such high zest / To children ardent for some desperate glory, / The old Lie: Dulce et decorum est / Pro patria mori [It is sweet and fitting to die for one's country]."*
    - **Options**:
     - (a) Industrialized chemical warfare and trench slaughter exposed patriotic romanticism about military glory as a cruel illusion
     - (b) Poison gas was an ineffective weapon that caused little fear among frontline infantry
     - (c) Soldiers thoroughly enjoyed fighting on the Western Front because of military camaraderie
     - (d) War poetry should be used to encourage school children to volunteer for the army
    - **Correct**: `a`
    - **Hint**: Owen explicitly calls the ancient Roman phrase "it is sweet and noble to die for your country" an "old Lie."
    - **Explanation**: Wilfred Owen used visceral imagery of chlorine gas asphyxiation to refute 19th-century romanticized myths of glorious combat, illustrating the grotesque physical trauma of mechanized industrial slaughter.

18. **ID**: `u3-t3-propaganda-poster-analysis`
    - **Skill**: `source_analysis` | **Reading Demand**: `high`
    - **Stem**: During World War I, government propaganda posters frequently depicted the enemy as ruthless monsters or brutes menacing defenseless women and children. What was the primary psychological goal of this propaganda?
    - **Options**:
     - (a) To dehumanize the adversary, inflame patriotic fervor, and convince civilians that compromise or negotiated peace was impossible
     - (b) To encourage soldiers to study the enemy's literary masterpieces and language
     - (c) To advertise travel vacation tours to enemy capital cities
     - (d) To inform the public about fair, objective, and verified neutral news reports
    - **Correct**: `a`
    - **Hint**: Propaganda works by appealing to emotion (fear and moral outrage) rather than rational deliberation.
    - **Explanation**: Wartime propaganda demonized the enemy to overcome civilian war weariness, boost recruiting, justify strict censorship, and build unwavering domestic support for unconditional victory.

---

#### UNIT 4: Interwar Years & World War II (6 New Questions)

##### Tier 1 (Recall & Core Vocabulary)
19. **ID**: `u4-t1-great-depression-dictators`
    - **Skill**: `recall` | **Reading Demand**: `low`
    - **Stem**: Which global economic catastrophe in 1929 wiped out bank savings, triggered mass unemployment, and enabled fascist demagogues to seize power in Germany and Japan?
    - **Options**:
     - (a) The Great Depression
     - (b) The Panic of 1837
     - (c) The South Sea Bubble
     - (d) The Marshall Plan
    - **Correct**: `a`
    - **Hint**: The Wall Street stock market crash of October 1929 had a devastating global domino effect.
    - **Explanation**: The worldwide Great Depression plunged Germany and Japan into extreme economic distress, destroying confidence in democratic institutions and creating fertile ground for radical fascist and militarist takeovers.

20. **ID**: `u4-t1-dday-normandy`
    - **Skill**: `recall` | **Reading Demand**: `low`
    - **Stem**: On June 6, 1944 (D-Day), Allied amphibious forces carried out Operation Overlord, landing on the beaches of Normandy to:
    - **Options**:
     - (a) Liberate Western Europe from Nazi military control and open a major second front
     - (b) Evacuate British soldiers back to the English coastline
     - (c) Sign an immediate truce with German military generals in Berlin
     - (d) Launch a surprise naval raid against Tokyo harbor
    - **Correct**: `a`
    - **Hint**: American, British, and Canadian forces stormed fortified French beaches to break Hitler's "Atlantic Wall."
    - **Explanation**: D-Day was the largest amphibious military invasion in history, successfully establishing an Allied foothold in northern France that allowed armies to liberate Paris and advance eastward toward Germany.

##### Tier 2 (Conceptual & Cause/Effect)
21. **ID**: `u4-t2-molotov-ribbentrop-pact`
    - **Skill**: `cause_effect` | **Reading Demand**: `medium`
    - **Stem**: In August 1939, ideological mortal enemies Nazi Germany and the Communist Soviet Union shocked the world by signing the Non-Aggression Pact. What secret agreement did it contain?
    - **Options**:
     - (a) The two dictatorships secretly agreed to divide Poland and the Baltic States between themselves
     - (b) Hitler agreed to convert Germany into a communist satellite state
     - (c) Stalin agreed to surrender the entire city of Moscow to the German navy
     - (d) Both nations pledged to immediately abandon all tanks, warplanes, and rifles
    - **Correct**: `a`
    - **Hint**: The pact allowed Hitler to invade western Poland without fearing a two-front war, while the USSR seized eastern Poland.
    - **Explanation**: The German-Soviet Non-Aggression Pact freed Hitler to launch his blitzkrieg against Poland on September 1, 1939, while secretly carving up Eastern Europe into German and Soviet spheres of influence.

22. **ID**: `u4-t2-fascism-vs-communism`
    - **Skill**: `cause_effect` | **Reading Demand**: `medium`
    - **Stem**: While both totalitarian regimes under Adolf Hitler (Fascism) and Joseph Stalin (Communism) operated one-party police states, how did their core ideologies differ?
    - **Options**:
     - (a) Fascism promoted ultra-nationalism, racial hierarchy, and private corporate ownership, whereas Soviet Communism promoted international working-class revolution and state ownership of all property
     - (b) Fascism believed in absolute pacifism, while Communism favored military world conquest
     - (c) Communism allowed complete free speech and multi-party voting, while Fascism outlawed voting
     - (d) Fascism was founded by rural farmers, while Communism was created by wealthy bankers
    - **Correct**: `a`
    - **Hint**: Fascists preserved private business monopolies subordinated to state glory; communists abolished private capital entirely in favor of collective state control.
    - **Explanation**: Totalitarianism took different ideological forms: Fascism centered on racial/national superiority and glorified militaristic state capitalism, while Communism proclaimed an egalitarian classless society via proletarian revolution and state-run command economics.

##### Tier 3 (Analytical & Primary Source Analysis)
23. **ID**: `u4-t3-churchill-speeches`
    - **Skill**: `source_analysis` | **Reading Demand**: `high`
    - **Stem**: Read this excerpt from British Prime Minister Winston Churchill's June 1940 address to Parliament following the fall of France. What strategic purpose did this speech serve?
    - **Excerpt**: *"We shall fight on the seas and oceans, we shall fight with growing confidence and growing strength in the air, we shall defend our island, whatever the cost may be. We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall fight in the hills; we shall never surrender."*
    - **Options**:
     - (a) To instill unyielding national morale and demonstrate to Nazi Germany that Britain would not negotiate an appeasement surrender despite standing alone
     - (b) To announce Britain's immediate plan to abandon its colonial empire in Asia
     - (c) To plead for a negotiated ceasefire with the Italian navy
     - (d) To instruct British civilians to evacuate the British Isles and relocate to Australia
    - **Correct**: `a`
    - **Hint**: With continental Europe under Nazi occupation, Churchill rallied British defiance to resist Hitler during the upcoming Battle of Britain.
    - **Explanation**: Churchill's impassioned rhetoric mobilized British public resolve, demonstrating that the UK would withstand German aerial bombing rather than accept terms from Hitler, keeping the Allied cause alive until Soviet and US entry.

24. **ID**: `u4-t3-universal-declaration-human-rights`
    - **Skill**: `source_analysis` | **Reading Demand**: `high`
    - **Stem**: In 1948, the United Nations General Assembly adopted the *Universal Declaration of Human Rights* (UDHR). How did this international treaty directly reflect the global lessons learned from World War II and the Holocaust?
    - **Options**:
     - (a) It established that sovereign governments cannot claim national borders to shield state-sponsored mass murder, proclaiming universal civil, political, and human rights for all human beings
     - (b) It mandated that all nations must merge into a single global government governed from New York
     - (c) It declared that defeated Axis countries were forbidden from having schools or hospitals
     - (d) It required all future wars to be fought exclusively with traditional cavalry sabers
    - **Correct**: `a`
    - **Hint**: The Nuremberg Trials and the horror of the concentration camps proved that individual human dignity transcends state laws.
    - **Explanation**: Drafted under Eleanor Roosevelt's leadership, the UDHR responded to Nazi atrocities by establishing an international standard of fundamental human rights that every government is morally obligated to protect.

---

### 2. Summary of Full Question Bank After Update

| Unit | Existing (Reworded) | New Inspired Questions | Total Questions in Unit |
| :--- | :---: | :---: | :---: |
| **Unit 1: Absolutism & Revolutions** | 9 | +6 (2 T1, 2 T2, 2 T3) | **15 Questions** |
| **Unit 2: Industrial Revolution** | 9 | +6 (2 T1, 2 T2, 2 T3) | **15 Questions** |
| **Unit 3: WWI & Global Imperialism** | 9 | +6 (2 T1, 2 T2, 2 T3) | **15 Questions** |
| **Unit 4: Interwar Years & WWII** | 9 | +6 (2 T1, 2 T2, 2 T3) | **15 Questions** |
| **TOTALS** | **36 Reworded** | **+24 New** | **60 Total Questions** |

---

### 3. Implementation Steps Upon Approval

1. **Update `src/data/questionBank.ts`**:
   - Apply conceptual paraphrasing to the 36 existing questions.
   - Insert the 24 new questions drafted above with clean TypeScript types.
2. **Execute Automated Verification**:
   - Run `lint_applet` (`tsc --noEmit`) to verify 0 type errors.
   - Run `compile_applet` (`vite build`) to confirm successful static bundle generation.
3. **Gameplay & Data Verification**:
   - Verify that option randomization properly scrambles choices for both existing and new questions.
   - Verify 50:50 lifelines eliminate 2 distractors accurately.
   - Confirm teacher dashboard correctly aggregates performance across all 60 items.
