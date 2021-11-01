export class Drug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }

  /**
   * Called to handle the action of time on the current drug and apply it
   * @param {Drug} currentDrug 
   */
  updateExpiration(currentDrug) {
    let expirationSpeed = 1;

    let lastingTime = currentDrug.expiresIn - 1 * expirationSpeed;
    currentDrug.expiresIn = lastingTime;
  }

  /**
   * As the Fervex drug has multiple efficiency changes over time we can use a specific function
   * to handle the logic and returning the accurate benefitEffect for this.updateDrugEfficiency()
   * @param {Drug} drug of the current drug
   * @returns benefitEffect
   */
  handleFervexCase(currentdrug) {
    const expirationDays = currentdrug.expiresIn

    if (expirationDays >= 0) {
      if (expirationDays <= 10 && expirationDays > 5) {
        return -2;
      } else if (expirationDays <= 5) {
        return -3;
      } else {
        return -1;
      }
    } else {
      // unecessary else block but added for readability
      return currentdrug.benefit;
    }
  }

  /**
   * Considering time affects our products and some in specific ways, this function
   * helps us handling this and getting a clear view on which are specific cases and
   * how time affects the benefit by applying "benefitEffect" to it
   * @param {Drug} currentDrug 
   */
  updateDrugEfficiency(currentDrug) {
    let benefitEffect = currentDrug.expiresIn >= 0 ? 1 : 2;
    switch (currentDrug.name) {
      case "Dafalgan":
        benefitEffect = 2 * benefitEffect;
        break;
      case "Herbal Tea":
        benefitEffect = -1 * benefitEffect;
        break;
      case "Fervex":
        benefitEffect = this.handleFervexCase(currentDrug);
        break;
      default:
        benefitEffect = benefitEffect;
        break;
    }

    currentDrug.benefit = currentDrug.benefit - benefitEffect;
  }

  /**
   * Make sure no benefit data gets out of range by caping them to 0 (min) and 50 (max)
   * @param {Drug} currentDrug 
   */
  handlingBenefitCap(currentDrug) {
    if (currentDrug.benefit < 0) {
      currentDrug.benefit = 0;
    } else if (currentDrug.benefit > 50) {
      currentDrug.benefit = 50;
    }
  }

  /**
   * updateBenefitValue loops through our drugs and call the different methods to 
   * apply both time and its effect on the drugs we sell and returns the complete array
   * as results
   * @returns drugs array
   */
  updateBenefitValue() {
    for (var i = 0; i < this.drugs.length; i++) {
      // Note: Magic pill does not change over time, it's a very specific case
      if (this.drugs[i].name === "Magic Pill") {
        this.handlingBenefitCap(this.drugs[i]);
      } else {
        this.updateExpiration(this.drugs[i]);
        this.updateDrugEfficiency(this.drugs[i]);
        this.handlingBenefitCap(this.drugs[i]);
      }
    }

    return this.drugs;
  }
}
