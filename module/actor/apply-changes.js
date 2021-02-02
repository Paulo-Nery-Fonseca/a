import { ItemChange } from "../item/components/change.js";

export function applyChanges() {
  this.changeOverrides = {};
  const c = Array.from(this.changes);

  // Organize changes by priority
  c.sort((a, b) => _sortChanges.call(this, a, b));

  // Parse change flags
  for (let i of this.changeItems) {
    for (const [k, v] of Object.entries(getProperty(i.data, "data.changeFlags"))) {
      if (v === true) {
        this.flags[k] = true;

        if (k === "loseDexToAC") {
          for (const k2 of ["normal", "touch"]) {
            getSourceInfo(this.sourceInfo, `data.attributes.ac.${k2}.total`).negative.push({
              value: game.i18n.localize("PF1.ChangeFlagLoseDexToAC"),
              name: i.name,
              type: i.type,
            });
          }
          getSourceInfo(this.sourceInfo, "data.attributes.cmd.total").negative.push({
            value: game.i18n.localize("PF1.ChangeFlagLoseDexToAC"),
            name: i.name,
            type: i.type,
          });
        }
      }
    }
  }

  // Apply all changes
  for (let change of c) {
    let flats = getChangeFlat.call(this, change.subTarget, change.modifier);
    if (!(flats instanceof Array)) flats = [flats];
    for (const f of flats) {
      if (!this.changeOverrides[f]) this.changeOverrides[f] = createOverride();
    }

    change.applyChange(this, flats, this.flags);
  }

  resetSkills.call(this);

  this.changeOverrides = expandObject(this.changeOverrides);
}

const createOverride = function () {
  const result = {
    add: {},
    set: {},
  };

  for (let k of Object.keys(CONFIG.PF1.bonusModifiers)) {
    result.add[k] = null;
    result.set[k] = null;
  }

  return result;
};

const getSortChangePriority = function () {
  const skillTargets = this._skillTargets;
  return {
    types: [
      "acpA",
      "acpS",
      "mDexA",
      "mDexS",
      "str",
      "dex",
      "con",
      "int",
      "wis",
      "cha",
      "skills",
      "strSkills",
      "dexSkills",
      "conSkills",
      "intSkills",
      "wisSkills",
      "chaSkills",
      ...skillTargets,
      "allChecks",
      "strChecks",
      "dexChecks",
      "conChecks",
      "intChecks",
      "wisChecks",
      "chaChecks",
      "landSpeed",
      "climbSpeed",
      "swimSpeed",
      "burrowSpeed",
      "flySpeed",
      "allSpeeds",
      "ac",
      "aac",
      "sac",
      "nac",
      "attack",
      "mattack",
      "rattack",
      "damage",
      "wdamage",
      "sdamage",
      "allSavingThrows",
      "fort",
      "ref",
      "will",
      "cmb",
      "cmd",
      "init",
      "mhp",
      "wounds",
      "vigor",
    ],
    modifiers: [
      "untyped",
      "untypedPerm",
      "base",
      "enh",
      "dodge",
      "inherent",
      "deflection",
      "morale",
      "luck",
      "sacred",
      "insight",
      "resist",
      "profane",
      "trait",
      "racial",
      "size",
      "competence",
      "circumstance",
      "alchemical",
      "penalty",
    ],
  };
};

const _sortChanges = function (a, b) {
  const priority = getSortChangePriority.call(this);
  const typeA = priority.types.indexOf(a.subTarget);
  const typeB = priority.types.indexOf(b.subTarget);
  const modA = priority.modifiers.indexOf(a.modifier);
  const modB = priority.modifiers.indexOf(b.modifier);
  let prioA = typeof a.priority === "string" ? parseInt(a.priority) : a.priority;
  let prioB = typeof b.priority === "string" ? parseInt(b.priority) : b.priority;
  prioA = (prioA || 0) + 1000;
  prioB = (prioB || 0) + 1000;

  return prioB - prioA || typeA - typeB || modA - modB;
};

export const getChangeFlat = function (changeTarget, changeType, curData = null) {
  curData = curData ?? this.data.data;
  let result = [];

  switch (changeTarget) {
    case "mhp":
      return "data.attributes.hp.max";
    case "wounds":
      return "data.attributes.wounds.max";
    case "vigor":
      return "data.attributes.vigor.max";
    case "str":
    case "dex":
    case "con":
    case "int":
    case "wis":
    case "cha":
      if (changeType === "penalty") return `data.abilities.${changeTarget}.penalty`;
      if (CONFIG.PF1.stackingBonusModifiers.indexOf(changeType) !== -1)
        return [`data.abilities.${changeTarget}.total`, `data.abilities.${changeTarget}.base`];
      return `data.abilities.${changeTarget}.total`;
    case "ac":
      if (changeType === "dodge")
        return ["data.attributes.ac.normal.total", "data.attributes.ac.touch.total", "data.attributes.cmd.total"];
      else if (changeType === "deflection") {
        return [
          "data.attributes.ac.normal.total",
          "data.attributes.ac.touch.total",
          "data.attributes.ac.flatFooted.total",
          "data.attributes.cmd.total",
          "data.attributes.cmd.flatFootedTotal",
        ];
      }
      return [
        "data.attributes.ac.normal.total",
        "data.attributes.ac.touch.total",
        "data.attributes.ac.flatFooted.total",
      ];
    case "aac":
      return "temp.ac.armor";
    case "sac":
      return "temp.ac.shield";
    case "nac":
      return "temp.ac.natural";
    case "attack":
      return "data.attributes.attack.general";
    case "mattack":
      return "data.attributes.attack.melee";
    case "rattack":
      return "data.attributes.attack.ranged";
    case "damage":
      return "data.attributes.damage.general";
    case "wdamage":
      return "data.attributes.damage.weapon";
    case "sdamage":
      return "data.attributes.damage.spell";
    case "allSavingThrows":
      return [
        "data.attributes.savingThrows.fort.total",
        "data.attributes.savingThrows.ref.total",
        "data.attributes.savingThrows.will.total",
      ];
    case "fort":
      return "data.attributes.savingThrows.fort.total";
    case "ref":
      return "data.attributes.savingThrows.ref.total";
    case "will":
      return "data.attributes.savingThrows.will.total";
    case "skills":
      for (let [a, skl] of Object.entries(curData.skills)) {
        if (skl == null) continue;
        result.push(`data.skills.${a}.changeBonus`);

        if (skl.subSkills != null) {
          for (let b of Object.keys(skl.subSkills)) {
            result.push(`data.skills.${a}.subSkills.${b}.changeBonus`);
          }
        }
      }
      return result;
    case "strSkills":
      for (let [a, skl] of Object.entries(curData.skills)) {
        if (skl == null) continue;
        if (skl.ability === "str") result.push(`data.skills.${a}.changeBonus`);

        if (skl.subSkills != null) {
          for (let [b, subSkl] of Object.entries(skl.subSkills)) {
            if (subSkl != null && subSkl.ability === "str") result.push(`data.skills.${a}.subSkills.${b}.changeBonus`);
          }
        }
      }
      return result;
    case "dexSkills":
      for (let [a, skl] of Object.entries(curData.skills)) {
        if (skl == null) continue;
        if (skl.ability === "dex") result.push(`data.skills.${a}.changeBonus`);

        if (skl.subSkills != null) {
          for (let [b, subSkl] of Object.entries(skl.subSkills)) {
            if (subSkl != null && subSkl.ability === "dex") result.push(`data.skills.${a}.subSkills.${b}.changeBonus`);
          }
        }
      }
      return result;
    case "conSkills":
      for (let [a, skl] of Object.entries(curData.skills)) {
        if (skl == null) continue;
        if (skl.ability === "con") result.push(`data.skills.${a}.changeBonus`);

        if (skl.subSkills != null) {
          for (let [b, subSkl] of Object.entries(skl.subSkills)) {
            if (subSkl != null && subSkl.ability === "con") result.push(`data.skills.${a}.subSkills.${b}.changeBonus`);
          }
        }
      }
      return result;
    case "intSkills":
      for (let [a, skl] of Object.entries(curData.skills)) {
        if (skl == null) continue;
        if (skl.ability === "int") result.push(`data.skills.${a}.changeBonus`);

        if (skl.subSkills != null) {
          for (let [b, subSkl] of Object.entries(skl.subSkills)) {
            if (subSkl != null && subSkl.ability === "int") result.push(`data.skills.${a}.subSkills.${b}.changeBonus`);
          }
        }
      }
      return result;
    case "wisSkills":
      for (let [a, skl] of Object.entries(curData.skills)) {
        if (skl == null) continue;
        if (skl.ability === "wis") result.push(`data.skills.${a}.changeBonus`);

        if (skl.subSkills != null) {
          for (let [b, subSkl] of Object.entries(skl.subSkills)) {
            if (subSkl != null && subSkl.ability === "wis") result.push(`data.skills.${a}.subSkills.${b}.changeBonus`);
          }
        }
      }
      return result;
    case "chaSkills":
      for (let [a, skl] of Object.entries(curData.skills)) {
        if (skl == null) continue;
        if (skl.ability === "cha") result.push(`data.skills.${a}.changeBonus`);

        if (skl.subSkills != null) {
          for (let [b, subSkl] of Object.entries(skl.subSkills)) {
            if (subSkl != null && subSkl.ability === "cha") result.push(`data.skills.${a}.subSkills.${b}.changeBonus`);
          }
        }
      }
      return result;
    case "allChecks":
      return [
        "data.abilities.str.checkMod",
        "data.abilities.dex.checkMod",
        "data.abilities.con.checkMod",
        "data.abilities.int.checkMod",
        "data.abilities.wis.checkMod",
        "data.abilities.cha.checkMod",
      ];
    case "strChecks":
      return "data.abilities.str.checkMod";
    case "dexChecks":
      return "data.abilities.dex.checkMod";
    case "conChecks":
      return "data.abilities.con.checkMod";
    case "intChecks":
      return "data.abilities.int.checkMod";
    case "wisChecks":
      return "data.abilities.wis.checkMod";
    case "chaChecks":
      return "data.abilities.cha.checkMod";
    case "allSpeeds":
      for (let speedKey of Object.keys(curData.attributes.speed)) {
        if (getProperty(curData, `attributes.speed.${speedKey}.base`))
          result.push(`data.attributes.speed.${speedKey}.total`);
      }
      return result;
    case "landSpeed":
      return "data.attributes.speed.land.total";
    case "climbSpeed":
      return "data.attributes.speed.climb.total";
    case "swimSpeed":
      return "data.attributes.speed.swim.total";
    case "burrowSpeed":
      return "data.attributes.speed.burrow.total";
    case "flySpeed":
      return "data.attributes.speed.fly.total";
    case "cmb":
      return "data.attributes.cmb.total";
    case "cmd":
      if (changeType === "dodge") return "data.attributes.cmd.total";
      return ["data.attributes.cmd.total", "data.attributes.cmd.flatFootedTotal"];
    case "init":
      return "data.attributes.init.total";
    case "acpA":
      return "data.attributes.acp.armorBonus";
    case "acpS":
      return "data.attributes.acp.shieldBonus";
    case "mDexA":
      return "data.attributes.mDex.armorBonus";
    case "mDexS":
      return "data.attributes.mDex.shieldBonus";
    case "spellResist":
      return "data.attributes.sr.total";
  }

  if (changeTarget.match(/^skill\.([a-zA-Z0-9]+)$/)) {
    const sklKey = RegExp.$1;
    if (curData.skills[sklKey] != null) {
      return `data.skills.${sklKey}.changeBonus`;
    }
  } else if (changeTarget.match(/^skill\.([a-zA-Z0-9]+)\.subSkills\.([a-zA-Z0-9]+)$/)) {
    const sklKey = RegExp.$1;
    const subSklKey = RegExp.$2;
    if (curData.skills[sklKey] != null && curData.skills[sklKey].subSkills[subSklKey] != null) {
      return `data.skills.${sklKey}.subSkills.${subSklKey}.changeBonus`;
    }
  }

  return null;
};

export const addDefaultChanges = function (changes) {
  // Class hit points
  const classes = this.data.items
    .filter((o) => o.type === "class" && !["racial"].includes(getProperty(o.data, "classType")))
    .sort((a, b) => {
      return a.sort - b.sort;
    });
  const racialHD = this.data.items
    .filter((o) => o.type === "class" && getProperty(o.data, "classType") === "racial")
    .sort((a, b) => {
      return a.sort - b.sort;
    });

  const healthConfig = game.settings.get("pf1", "healthConfig");
  const cls_options = this.data.type === "character" ? healthConfig.hitdice.PC : healthConfig.hitdice.NPC;
  const race_options = healthConfig.hitdice.Racial;
  const round = { up: Math.ceil, nearest: Math.round, down: Math.floor }[healthConfig.rounding];
  const continuous = { discrete: false, continuous: true }[healthConfig.continuity];

  const push_health = (value, source) => {
    changes.push(
      ItemChange.create({
        formula: value.toString(),
        target: "misc",
        subTarget: "mhp",
        modifier: "untypedPerm",
        source: source.name,
      })
    );
    changes.push(
      ItemChange.create({
        formula: value.toString(),
        target: "misc",
        subTarget: "vigor",
        modifier: "untypedPerm",
        source: source.name,
      })
    );

    getSourceInfo(this.sourceInfo, "data.attributes.hp.max").positive.push({
      value: value,
      name: source.name,
    });
    getSourceInfo(this.sourceInfo, "data.attributes.vigor.max").positive.push({
      value: value,
      name: source.name,
    });
  };
  const manual_health = (health_source) => {
    let health = health_source.data.hp + (health_source.data.classType === "base") * health_source.data.fc.hp.value;
    if (!continuous) health = round(health);
    push_health(health, health_source);
  };
  const auto_health = (health_source, options, maximized = 0) => {
    if (health_source.data.hd === 0) return;

    let die_health = 1 + (health_source.data.hd - 1) * options.rate;
    if (!continuous) die_health = round(die_health);

    const maxed_health = Math.min(health_source.data.level, maximized) * health_source.data.hd;
    const level_health = Math.max(0, health_source.data.level - maximized) * die_health;
    const favor_health = (health_source.data.classType === "base") * health_source.data.fc.hp.value;
    let health = maxed_health + level_health + favor_health;

    push_health(health, health_source);
  };
  const compute_health = (health_sources, options) => {
    // Compute and push health, tracking the remaining maximized levels.
    if (options.auto) {
      let maximized = options.maximized;
      for (const hd of health_sources) {
        auto_health(hd, options, maximized);
        maximized = Math.max(0, maximized - hd.data.level);
      }
    } else health_sources.forEach((race) => manual_health(race));
  };

  compute_health(racialHD, race_options);
  compute_health(classes, cls_options);

  // Add class data to saving throws
  for (let a of Object.keys(this.data.data.attributes.savingThrows)) {
    const k = `data.attributes.savingThrows.${a}.total`;
    // Using Fractional Base Bonuses
    if (game.settings.get("pf1", "useFractionalBaseBonuses")) {
      let highStart = false;
      setProperty(
        this.data,
        k,
        Math.floor(
          classes.reduce((cur, obj) => {
            const saveScale = getProperty(obj, `data.savingThrows.${a}.value`) || "";
            if (saveScale === "high") {
              const acc = highStart ? 0 : 2;
              highStart = true;
              return cur + obj.data.level / 2 + acc;
            }
            if (saveScale === "low") return cur + obj.data.level / 3;
            return cur;
          }, 0)
        )
      );

      const v = getProperty(this.data, k);
      if (v !== 0) {
        getSourceInfo(this.sourceInfo, k).positive.push({ name: game.i18n.localize("PF1.Base"), value: v });
      }
    } else {
      setProperty(
        this.data,
        k,
        classes.reduce((cur, obj) => {
          const classType = getProperty(obj.data, "classType") || "base";
          let formula = CONFIG.PF1.classSavingThrowFormulas[classType][obj.data.savingThrows[a].value];
          if (formula == null) formula = "0";
          const v = Math.floor(new Roll(formula, { level: obj.data.level }).roll().total);

          if (v !== 0) {
            getSourceInfo(this.sourceInfo, k).positive.push({ name: getProperty(obj, "name"), value: v });
          }

          return cur + v;
        }, 0)
      );
    }
  }

  // Add Constitution to HP
  let hpAbility = getProperty(this.data, "data.attributes.hpAbility");
  if (hpAbility == null) hpAbility = "con";
  if (hpAbility !== "") {
    changes.push(
      ItemChange.create({
        formula: `@abilities.${hpAbility}.mod * @attributes.hd.total`,
        target: "misc",
        subTarget: "mhp",
        modifier: "base",
      })
    );
    changes.push(
      ItemChange.create({
        formula: `@abilities.${hpAbility}.total + @abilities.${hpAbility}.drain`,
        target: "misc",
        subTarget: "wounds",
        modifier: "base",
      })
    );
    getSourceInfo(this.sourceInfo, "data.attributes.hp.max").positive.push({
      formula: `@abilities.${hpAbility}.mod * @attributes.hd.total`,
      name: CONFIG.PF1.abilities[hpAbility],
    });
    getSourceInfo(this.sourceInfo, "data.attributes.wounds.max").positive.push({
      formula: `@abilities.${hpAbility}.total + @abilities.${hpAbility}.drain`,
      name: CONFIG.PF1.abilities[hpAbility],
    });
  }

  // Add movement speed(s)
  for (let [k, s] of Object.entries(this.data.data.attributes.speed)) {
    let base = s.base;
    if (!base) base = 0;
    changes.push(
      ItemChange.create({
        formula: base.toString(),
        target: "speed",
        subTarget: `${k}Speed`,
        modifier: "base",
        operator: "set",
        priority: 1000,
      })
    );
    if (base > 0) {
      getSourceInfo(this.sourceInfo, `data.attributes.speed.${k}.total`).positive.push({
        value: base,
        name: game.i18n.localize("PF1.Base"),
      });
    }
  }

  // Add variables to CMD and CMD
  {
    // BAB to CMB
    changes.push(
      ItemChange.create({
        formula: "@attributes.bab.total",
        target: "misc",
        subTarget: "cmb",
        modifier: "untypedPerm",
      })
    );
    getSourceInfo(this.sourceInfo, "data.attributes.cmb.total").positive.push({
      formula: "@attributes.bab.total",
      name: game.i18n.localize("PF1.BAB"),
    });
    // Ability to CMB
    {
      const abl = getProperty(this.data, "data.attributes.cmbAbility");
      if (abl) {
        changes.push(
          ItemChange.create({
            formula: `@abilities.${abl}.mod`,
            target: "misc",
            subTarget: "cmb",
            modifier: "untypedPerm",
          })
        );
        getSourceInfo(this.sourceInfo, "data.attributes.cmb.total").positive.push({
          formula: `@abilities.${abl}.mod`,
          name: CONFIG.PF1.abilities[abl],
        });
      }
    }
    // Energy Drain to CMB
    changes.push(
      ItemChange.create({
        formula: "-@attributes.energyDrain",
        target: "misc",
        subTarget: "cmb",
        modifier: "untypedPerm",
      })
    );
    getSourceInfo(this.sourceInfo, "data.attributes.cmb.total").negative.push({
      formula: `-@attributes.energyDrain`,
      name: game.i18n.localize("PF1.CondTypeEnergyDrain"),
    });
    // BAB to CMD
    changes.push(
      ItemChange.create({
        formula: "@attributes.bab.total",
        target: "misc",
        subTarget: "cmd",
        modifier: "untypedPerm",
      })
    );
    for (const k of ["total", "flatFootedTotal"]) {
      getSourceInfo(this.sourceInfo, `data.attributes.cmd.${k}`).positive.push({
        formula: "@attributes.bab.total",
        name: game.i18n.localize("PF1.BAB"),
      });
    }
    // Strength to CMD
    changes.push(
      ItemChange.create({
        formula: "@abilities.str.mod",
        target: "misc",
        subTarget: "cmd",
        modifier: "untypedPerm",
      })
    );
    for (const k of ["total", "flatFootedTotal"]) {
      getSourceInfo(this.sourceInfo, `data.attributes.cmd.${k}`).positive.push({
        formula: "@abilities.str.mod",
        name: CONFIG.PF1.abilities["str"],
      });
    }
    // Energy Drain to CMD
    changes.push(
      ItemChange.create({
        formula: "-@attributes.energyDrain",
        target: "misc",
        subTarget: "cmd",
        modifier: "untypedPerm",
        source: game.i18n.localize("PF1.CondTypeEnergyDrain"),
      })
    );
    for (const k of ["total", "flatFootedTotal"]) {
      getSourceInfo(this.sourceInfo, `data.attributes.cmd.${k}`).negative.push({
        formula: "-@attributes.energyDrain",
        name: game.i18n.localize("PF1.CondTypeEnergyDrain"),
      });
    }
  }

  // Add Dexterity Modifier to Initiative
  {
    const abl = getProperty(this.data, "data.attributes.init.ability");
    if (abl) {
      changes.push(
        ItemChange.create({
          formula: `@abilities.${abl}.mod`,
          target: "misc",
          subTarget: "init",
          modifier: "untypedPerm",
          priority: -100,
        })
      );
      getSourceInfo(this.sourceInfo, "data.attributes.init.total").positive.push({
        formula: `@abilities.${abl}.mod`,
        name: CONFIG.PF1.abilities[abl],
      });
    }

    // Add ACP penalty
    if (["str", "dex"].includes(abl)) {
      changes.push(
        ItemChange.create({
          formula: "-@attributes.acp.attackPenalty",
          target: "misc",
          subTarget: "init",
          modifier: "penalty",
          priority: -100,
        })
      );
      getSourceInfo(this.sourceInfo, "data.attributes.init.total").negative.push({
        formula: "-@attributes.acp.attackPenalty",
        name: game.i18n.localize("PF1.ArmorCheckPenalty"),
      });
    }
  }

  // Add Ability modifiers and Energy Drain to saving throws
  {
    let abl;
    // Ability Mod to Fortitude
    abl = getProperty(this.data, "data.attributes.savingThrows.fort.ability");
    if (abl) {
      changes.push(
        ItemChange.create({
          formula: `@abilities.${abl}.mod`,
          target: "savingThrows",
          subTarget: "fort",
          modifier: "untypedPerm",
        })
      );
      getSourceInfo(this.sourceInfo, "data.attributes.savingThrows.fort.total").positive.push({
        formula: `@abilities.${abl}.mod`,
        name: CONFIG.PF1.abilities[abl],
      });
    }
    // Ability Mod to Reflex
    abl = getProperty(this.data, "data.attributes.savingThrows.ref.ability");
    if (abl) {
      changes.push(
        ItemChange.create({
          formula: `@abilities.${abl}.mod`,
          target: "savingThrows",
          subTarget: "ref",
          modifier: "untypedPerm",
        })
      );
      getSourceInfo(this.sourceInfo, "data.attributes.savingThrows.ref.total").positive.push({
        formula: `@abilities.${abl}.mod`,
        name: CONFIG.PF1.abilities[abl],
      });
    }
    // Ability Mod to Will
    abl = getProperty(this.data, "data.attributes.savingThrows.will.ability");
    if (abl) {
      changes.push(
        ItemChange.create({
          formula: `@abilities.${abl}.mod`,
          target: "savingThrows",
          subTarget: "will",
          modifier: "untypedPerm",
        })
      );
      getSourceInfo(this.sourceInfo, "data.attributes.savingThrows.will.total").positive.push({
        formula: `@abilities.${abl}.mod`,
        name: CONFIG.PF1.abilities[abl],
      });
    }
    // Energy Drain
    changes.push(
      ItemChange.create({
        formula: "-@attributes.energyDrain",
        target: "savingThrows",
        subTarget: "allSavingThrows",
        modifier: "penalty",
      })
    );
    for (let k of Object.keys(getProperty(this.data, "data.attributes.savingThrows"))) {
      getSourceInfo(this.sourceInfo, `data.attributes.savingThrows.${k}.total`).positive.push({
        formula: "-@attributes.energyDrain",
        name: game.i18n.localize("PF1.CondTypeEnergyDrain"),
      });
    }
  }
  // Spell Resistance
  {
    const sr = getProperty(this.data, "data.attributes.sr.formula") || 0;
    changes.push(
      ItemChange.create({
        formula: sr.toString(),
        target: "misc",
        subTarget: "spellResist",
        modifier: "base",
        priority: 1000,
      })
    );
    getSourceInfo(this.sourceInfo, "data.attributes.sr.total").positive.push({
      formula: sr,
      name: game.i18n.localize("PF1.Base"),
    });
  }
  // Natural armor
  {
    const ac = getProperty(this.data, "data.attributes.naturalAC") || 0;
    changes.push(
      ItemChange.create({
        formula: ac.toString(),
        target: "ac",
        subTarget: "nac",
        modifier: "base",
      })
    );
    for (const k of ["normal", "flatFooted"]) {
      getSourceInfo(this.sourceInfo, `data.attributes.ac.${k}.total`).positive.push({
        formula: ac.toString(),
        name: game.i18n.localize("PF1.BuffTarACNatural"),
      });
    }
  }
  // Add armor bonuses from equipment
  this.data.items
    .filter((obj) => {
      return obj.type === "equipment" && obj.data.equipped;
    })
    .forEach((item) => {
      let armorTarget = "aac";
      if (item.data.equipmentType === "shield") armorTarget = "sac";
      // Push base armor
      if (item.data.armor.value) {
        let ac = item.data.armor.value;
        if (item.data.broken) ac = Math.floor(ac / 2);
        ac += item.data.armor.enh;
        changes.push(
          ItemChange.create({
            formula: ac.toString(),
            target: "ac",
            subTarget: armorTarget,
            modifier: "base",
          })
        );
        for (let k of ["normal", "flatFooted"]) {
          getSourceInfo(this.sourceInfo, `data.attributes.ac.${k}.total`).positive.push({
            value: ac,
            name: item.name,
            type: item.type,
          });
        }
      }
    });

  // Add fly bonuses or penalties based on maneuverability
  {
    const flyKey = getProperty(this.data, "data.attributes.speed.fly.maneuverability");
    let flyValue = 0;
    if (flyKey != null) flyValue = CONFIG.PF1.flyManeuverabilityValues[flyKey];
    if (flyValue !== 0) {
      changes.push(
        ItemChange.create({
          formula: flyValue.toString(),
          target: "skill",
          subtarget: "skill.fly",
          modifier: "racial",
        })
      );
      getSourceInfo(this.sourceInfo, "data.skills.fly.changeBonus").positive.push({
        value: flyValue,
        name: game.i18n.localize("PF1.FlyManeuverability"),
      });
    }
  }
  // Add swim and climb skill bonuses based on having speeds for them
  {
    changes.push(
      ItemChange.create({
        formula: "@attributes.speed.climb.total > 0 ? 8 : 0",
        target: "skill",
        subTarget: "skill.clm",
        modifier: "racial",
      })
    );
    getSourceInfo(this.sourceInfo, "data.skills.clm.changeBonus").positive.push({
      formula: "@attributes.speed.climb.total > 0 ? 8 : 0",
      name: game.i18n.localize("PF1.SpeedClimb"),
    });

    changes.push(
      ItemChange.create({
        formula: "@attributes.speed.swim.total > 0 ? 8 : 0",
        target: "skill",
        subTarget: "skill.swm",
        modifier: "racial",
      })
    );
    getSourceInfo(this.sourceInfo, "data.skills.swm.changeBonus").positive.push({
      formula: "@attributes.speed.swim.total > 0 ? 8 : 0",
      name: game.i18n.localize("PF1.SpeedSwim"),
    });
  }

  // Add size bonuses to various attributes
  const sizeKey = this.data.data.traits.size;
  if (sizeKey !== "med") {
    // AC
    changes.push(
      ItemChange.create({
        formula: CONFIG.PF1.sizeMods[sizeKey].toString(),
        target: "ac",
        subTarget: "ac",
        modifier: "size",
      })
    );
    for (const k of ["normal", "touch", "flatFooted"]) {
      getSourceInfo(this.sourceInfo, `data.attributes.ac.${k}.total`).positive.push({
        value: CONFIG.PF1.sizeMods[sizeKey].toString(),
        type: "size",
      });
    }
    // Stealth skill
    changes.push(
      ItemChange.create({
        formula: CONFIG.PF1.sizeStealthMods[sizeKey].toString(),
        target: "skill",
        subTarget: "skill.ste",
        modifier: "size",
      })
    );
    getSourceInfo(this.sourceInfo, "data.skills.ste.changeBonus").positive.push({
      value: CONFIG.PF1.sizeStealthMods[sizeKey].toString(),
      type: "size",
    });
    // Fly skill
    changes.push(
      ItemChange.create({
        formula: CONFIG.PF1.sizeFlyMods[sizeKey].toString(),
        target: "skill",
        subTarget: "skill.fly",
        modifier: "size",
      })
    );
    getSourceInfo(this.sourceInfo, "data.skills.fly.changeBonus").positive.push({
      value: CONFIG.PF1.sizeFlyMods[sizeKey].toString(),
      type: "size",
    });
    // CMB
    changes.push(
      ItemChange.create({
        formula: CONFIG.PF1.sizeSpecialMods[sizeKey].toString(),
        target: "misc",
        subTarget: "cmb",
        modifier: "size",
      })
    );
    getSourceInfo(this.sourceInfo, "data.attributes.cmb.total").positive.push({
      value: CONFIG.PF1.sizeSpecialMods[sizeKey].toString(),
      type: "size",
    });
    // CMD
    changes.push(
      ItemChange.create({
        formula: CONFIG.PF1.sizeSpecialMods[sizeKey].toString(),
        target: "misc",
        subTarget: "cmd",
        modifier: "size",
      })
    );
    for (let k of ["total", "flatFootedTotal"]) {
      getSourceInfo(this.sourceInfo, `data.attributes.cmd.${k}`).positive.push({
        value: CONFIG.PF1.sizeSpecialMods[sizeKey].toString(),
        type: "size",
      });
    }
  }

  // Add conditions
  for (let [con, v] of Object.entries(this.data.data.attributes.conditions || {})) {
    if (!v) continue;

    switch (con) {
      case "blind":
        changes.push(
          ItemChange.create({
            formula: "-2",
            target: "ac",
            subTarget: "ac",
            modifier: "penalty",
          })
        );
        this.flags["loseDexToAC"] = true;

        for (let k of [
          "data.attributes.ac.normal.total",
          "data.attributes.ac.touch.total",
          "data.attributes.ac.flatFooted.total",
          "data.attributes.cmd.total",
          "data.attributes.cmd.flatFootedTotal",
        ]) {
          getSourceInfo(this.sourceInfo, k).negative.push({
            value: -2,
            name: game.i18n.localize("PF1.CondBlind"),
          });
        }
        for (let k of [
          "data.attributes.ac.normal.total",
          "data.attributes.ac.touch.total",
          "data.attributes.cmd.total",
          "data.attributes.cmd.flatFootedTotal",
        ]) {
          getSourceInfo(this.sourceInfo, k).negative.push({
            value: game.i18n.localize("PF1.ChangeFlagLoseDexToAC"),
            name: game.i18n.localize("PF1.CondBlind"),
          });
        }
        break;
      case "dazzled":
        changes.push(
          ItemChange.create({
            formula: "-1",
            target: "attack",
            subTarget: "attack",
            modifier: "penalty",
          })
        );
        getSourceInfo(this.sourceInfo, "data.attributes.attack.general").negative.push({
          value: -1,
          name: game.i18n.localize("PF1.CondDazzled"),
        });
        break;
      case "deaf":
        changes.push(
          ItemChange.create({
            formula: "-4",
            target: "misc",
            subTarget: "init",
            modifier: "penalty",
          })
        );
        getSourceInfo(this.sourceInfo, "data.attributes.init.total").negative.push({
          value: -4,
          name: game.i18n.localize("PF1.CondDeaf"),
        });
        break;
      case "entangled":
        changes.push(
          ItemChange.create({
            formula: "-4",
            target: "ability",
            subTarget: "dex",
            modifier: "penalty",
          })
        );
        getSourceInfo(this.sourceInfo, "data.abilities.dex.total").negative.push({
          value: -4,
          name: game.i18n.localize("PF1.CondEntangled"),
        });

        changes.push(
          ItemChange.create({
            formula: "-2",
            target: "attack",
            subTarget: "attack",
            modifier: "penalty",
          })
        );
        getSourceInfo(this.sourceInfo, "data.attributes.attack.general").negative.push({
          value: -2,
          name: game.i18n.localize("PF1.CondEntangled"),
        });
        break;
      case "grappled":
        changes.push(
          ItemChange.create({
            formula: "-4",
            target: "ability",
            subTarget: "dex",
            modifier: "penalty",
          })
        );
        getSourceInfo(this.sourceInfo, "data.abilities.dex.total").negative.push({
          value: -4,
          name: game.i18n.localize("PF1.CondGrappled"),
        });

        changes.push(
          ItemChange.create({
            formula: "-2",
            target: "attack",
            subTarget: "attack",
            modifier: "penalty",
          })
        );
        getSourceInfo(this.sourceInfo, "data.attributes.attack.general").negative.push({
          value: -2,
          name: game.i18n.localize("PF1.CondGrappled"),
        });

        changes.push(
          ItemChange.create({
            formula: "-2",
            target: "misc",
            subTarget: "cmb",
            modifier: "penalty",
          })
        );
        getSourceInfo(this.sourceInfo, "data.attributes.cmb.total").negative.push({
          value: -2,
          name: game.i18n.localize("PF1.CondGrappled"),
        });
        break;
      case "helpless":
        changes.push(
          ItemChange.create({
            formula: "0",
            target: "ability",
            subTarget: "dex",
            modifier: "untypedPerm",
            operator: "set",
            priority: -1000,
          })
        );
        getSourceInfo(this.sourceInfo, "data.abilities.dex.total").negative.push({
          name: game.i18n.localize("PF1.CondHelpless"),
          value: game.i18n.localize("PF1.ChangeFlagNoDex"),
        });
        break;
      case "paralyzed":
        changes.push(
          ItemChange.create({
            formula: "0",
            target: "ability",
            subTarget: "dex",
            modifier: "untypedPerm",
            operator: "set",
            priority: -1000,
          })
        );
        changes.push(
          ItemChange.create({
            formula: "0",
            target: "ability",
            subTarget: "str",
            modifier: "untypedPerm",
            operator: "set",
            priority: -1000,
          })
        );
        getSourceInfo(this.sourceInfo, "data.abilities.dex.total").negative.push({
          name: game.i18n.localize("PF1.CondParalyzed"),
          value: game.i18n.localize("PF1.ChangeFlagNoDex"),
        });
        getSourceInfo(this.sourceInfo, "data.abilities.str.total").negative.push({
          name: game.i18n.localize("PF1.CondParalyzed"),
          value: game.i18n.localize("PF1.ChangeFlagNoStr"),
        });
        break;
      case "pinned":
        this.flags["loseDexToAC"] = true;
        getSourceInfo(this.sourceInfo, "data.attributes.ac.normal.total").negative.push({
          name: game.i18n.localize("PF1.CondPinned"),
          value: game.i18n.localize("PF1.ChangeFlagLoseDexToAC"),
        });
        getSourceInfo(this.sourceInfo, "data.attributes.ac.touch.total").negative.push({
          name: game.i18n.localize("PF1.CondPinned"),
          value: game.i18n.localize("PF1.ChangeFlagLoseDexToAC"),
        });
        getSourceInfo(this.sourceInfo, "data.attributes.cmd.total").negative.push({
          name: game.i18n.localize("PF1.CondPinned"),
          value: game.i18n.localize("PF1.ChangeFlagLoseDexToAC"),
        });
        break;
      case "fear":
        changes.push(
          ItemChange.create({
            formula: "-2",
            target: "attack",
            subTarget: "attack",
            modifier: "penalty",
          })
        );
        getSourceInfo(this.sourceInfo, "data.attributes.attack.general").negative.push({
          value: -2,
          name: game.i18n.localize("PF1.CondFear"),
        });

        changes.push(
          ItemChange.create({
            formula: "-2",
            target: "savingThrows",
            subTarget: "allSavingThrows",
            modifier: "penalty",
          })
        );
        for (let k of Object.keys(this.data.data.attributes.savingThrows)) {
          getSourceInfo(this.sourceInfo, `data.attributes.savingThrows.${k}.total`).negative.push({
            value: -2,
            name: game.i18n.localize("PF1.CondFear"),
          });
        }

        {
          changes.push(
            ItemChange.create({
              formula: "-2",
              target: "skills",
              subTarget: "skills",
              modifier: "penalty",
            })
          );
          const flats = getChangeFlat.call(this, "skills", "penalty");
          for (let f of flats) {
            getSourceInfo(this.sourceInfo, f).negative.push({
              value: -2,
              name: game.i18n.localize("PF1.CondFear"),
            });
          }
        }

        {
          changes.push(
            ItemChange.create({
              formula: "-2",
              target: "abilityChecks",
              subTarget: "allChecks",
              modifier: "penalty",
            })
          );
          const flats = getChangeFlat.call(this, "allChecks", "penalty");
          for (let f of flats) {
            getSourceInfo(this.sourceInfo, f).negative.push({
              value: -2,
              name: game.i18n.localize("PF1.CondFear"),
            });
          }
        }
        break;
      case "sickened":
        changes.push(
          ItemChange.create({
            formula: "-2",
            target: "attack",
            subTarget: "attack",
            modifier: "penalty",
          })
        );
        getSourceInfo(this.sourceInfo, "data.attributes.attack.general").negative.push({
          value: -2,
          name: game.i18n.localize("PF1.CondSickened"),
        });

        changes.push(
          ItemChange.create({
            formula: "-2",
            target: "damage",
            subTarget: "wdamage",
            modifier: "penalty",
          })
        );
        getSourceInfo(this.sourceInfo, "data.attributes.damage.weapon").negative.push({
          value: -2,
          name: game.i18n.localize("PF1.CondSickened"),
        });

        changes.push(
          ItemChange.create({
            formula: "-2",
            target: "savingThrows",
            subTarget: "allSavingThrows",
            modifier: "penalty",
          })
        );
        for (let k of Object.keys(this.data.data.attributes.savingThrows)) {
          getSourceInfo(this.sourceInfo, `data.attributes.savingThrows.${k}.total`).negative.push({
            value: -2,
            name: game.i18n.localize("PF1.CondSickened"),
          });
        }

        {
          changes.push(
            ItemChange.create({
              formula: "-2",
              target: "skills",
              subTarget: "skills",
              modifier: "penalty",
            })
          );
          const flats = getChangeFlat.call(this, "skills", "penalty");
          for (let f of flats) {
            getSourceInfo(this.sourceInfo, f).negative.push({
              value: -2,
              name: game.i18n.localize("PF1.CondSickened"),
            });
          }
        }

        {
          changes.push(
            ItemChange.create({
              formula: "-2",
              target: "abilityChecks",
              subTarget: "allChecks",
              modifier: "penalty",
            })
          );
          const flats = getChangeFlat.call(this, "allChecks", "penalty");
          for (let f of flats) {
            getSourceInfo(this.sourceInfo, f).negative.push({
              value: -2,
              name: game.i18n.localize("PF1.CondSickened"),
            });
          }
        }
        break;
      case "stunned":
        changes.push(
          ItemChange.create({
            formula: "-2",
            target: "ac",
            subTarget: "ac",
            modifier: "penalty",
          })
        );
        for (const k of Object.keys(this.data.data.attributes.ac)) {
          getSourceInfo(this.sourceInfo, `data.attributes.ac.${k}.total`).negative.push({
            value: -2,
            name: game.i18n.localize("PF1.CondStunned"),
          });
        }
        this.flags["loseDexToAC"] = true;
        getSourceInfo(this.sourceInfo, "data.attributes.ac.normal.total").negative.push({
          name: game.i18n.localize("PF1.CondStunned"),
          value: game.i18n.localize("PF1.ChangeFlagLoseDexToAC"),
        });
        getSourceInfo(this.sourceInfo, "data.attributes.ac.touch.total").negative.push({
          name: game.i18n.localize("PF1.CondStunned"),
          value: game.i18n.localize("PF1.ChangeFlagLoseDexToAC"),
        });
        getSourceInfo(this.sourceInfo, "data.attributes.cmd.total").negative.push({
          name: game.i18n.localize("PF1.CondStunned"),
          value: game.i18n.localize("PF1.ChangeFlagLoseDexToAC"),
        });
        break;
    }
  }

  // Handle fatigue and exhaustion so that they don't stack
  if (this.data.data.attributes.conditions.exhausted) {
    changes.push(
      ItemChange.create({
        formula: "-6",
        target: "ability",
        subTarget: "str",
        modifier: "penalty",
      })
    );
    getSourceInfo(this.sourceInfo, "data.abilities.str.total").negative.push({
      value: -6,
      name: game.i18n.localize("PF1.CondExhausted"),
    });

    changes.push(
      ItemChange.create({
        formula: "-6",
        target: "ability",
        subTarget: "dex",
        modifier: "penalty",
      })
    );
    getSourceInfo(this.sourceInfo, "data.abilities.dex.total").negative.push({
      value: -6,
      name: game.i18n.localize("PF1.CondExhausted"),
    });
  } else if (this.data.data.attributes.conditions.fatigued) {
    changes.push(
      ItemChange.create({
        formula: "-2",
        target: "ability",
        subTarget: "str",
        modifier: "penalty",
      })
    );
    getSourceInfo(this.sourceInfo, "data.abilities.str.total").negative.push({
      value: -2,
      name: game.i18n.localize("PF1.CondFatigued"),
    });

    changes.push(
      ItemChange.create({
        formula: "-2",
        target: "ability",
        subTarget: "dex",
        modifier: "penalty",
      })
    );
    getSourceInfo(this.sourceInfo, "data.abilities.dex.total").negative.push({
      value: -2,
      name: game.i18n.localize("PF1.CondFatigued"),
    });
  }

  // Apply level drain to hit points
  if (!Number.isNaN(this.data.data.attributes.energyDrain) && this.data.data.attributes.energyDrain > 0) {
    changes.push(
      ItemChange.create({
        formula: "-(@attributes.energyDrain * 5)",
        target: "misc",
        subTarget: "mhp",
        modifier: "untyped",
        priority: -750,
      })
    );
    getSourceInfo(this.sourceInfo, "data.attributes.hp.max").negative.push({
      formula: "-(@attributes.energyDrain * 5)",
      name: game.i18n.localize("PF1.CondTypeEnergyDrain"),
    });

    changes.push(
      ItemChange.create({
        formula: "-(@attributes.energyDrain * 5)",
        target: "misc",
        subTarget: "vigor",
        modifier: "untyped",
        priority: -750,
      })
    );
    getSourceInfo(this.sourceInfo, "data.attributes.vigor.max").negative.push({
      formula: "-(@attributes.energyDrain * 5)",
      name: game.i18n.localize("PF1.CondTypeEnergyDrain"),
    });
  }
};

const resetSkills = function () {
  const skills = this.data.data.skills;
  const energyDrain = Math.abs(this.data.data.attributes.energyDrain);

  for (const [sklKey, skl] of Object.entries(skills)) {
    if (!skl) continue;

    let acpPenalty = skl.acp ? this.data.data.attributes.acp.total : 0;
    let ablMod = this.data.data.abilities[skl.ability].mod;
    let specificSkillBonus = skl.changeBonus || 0;

    // Parse main skills
    let sklValue = skl.rank + (skl.cs && skl.rank > 0 ? 3 : 0) + ablMod + specificSkillBonus - acpPenalty - energyDrain;
    setProperty(this.data, `data.skills.${sklKey}.mod`, sklValue);

    // Parse sub-skills
    for (const [subSklKey, subSkl] of Object.entries(skl.subSkills || {})) {
      if (!subSkl) continue;
      if (!getProperty(this.data, `data.skills.${sklKey}.subSkills.${subSklKey}`)) continue;

      acpPenalty = subSkl.acp ? this.data.data.attributes.acp.total : 0;
      ablMod = this.data.data.abilities[subSkl.ability];
      specificSkillBonus = subSkl.changeBonus || 0;
      sklValue =
        subSkl.rank + (subSkl.cs && subSkl.rank > 0 ? 3 : 0) + ablMod + specificSkillBonus - acpPenalty - energyDrain;
      setProperty(this.data, `data.skills.${sklKey}.subSkills.${subSklKey}.mod`, sklValue);
    }
  }
};

export const getSourceInfo = function (obj, key) {
  if (!obj[key]) {
    obj[key] = { negative: [], positive: [] };
  }
  return obj[key];
};