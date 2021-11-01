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

  // Une fois la date d'expiration en dessous de zero, le benefit se dégrade 2x plus vite
  // Expiration <= 0 : benefit = benefit - (2x pourri)
  // Expiration > 0 : benefit = benefit - (1x pourri)

  // if benefit <= 0 {benefit = 0}
  // if benefit >= 50 {benefit = 50 }

  // Magic Pill => Expiration speed = 0; pourri = 0
  // Herbal Tea => pourri = -1
  // Fervex => pourri = -1; If Expiration date <= 10 {pourri = -2}; if Expiration Date  <= 5  {pourri = -3}; If Expiration Date = 0 { pourri = benefit }
  // Dafalgan => pourri = -2

  updateExpiration(currentDrug) {
    let expirationSpeed = 1;

    let lastingTime = currentDrug.expiresIn - 1 * expirationSpeed;
    currentDrug.expiresIn = lastingTime;
  }

  /**
   * As the Fervex drug has multiple efficiency changes over time we can use a specific function
   * to handle the logic and returning the accurate benefitEffect for this.updateDrugEfficiency()
   * @param {Drug} drug of the current drug
   * @returns
   */
  handleFervexCase(currentdrug) {
    const expirationDays = currentdrug.expiresIn

    if (expirationDays > 0) {
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

  updateDrugEfficiency(currentDrug) {
    let benefitEffect = currentDrug.expiresIn > 0 ? 1 : 2;

    switch (currentDrug.name) {
      case "Dafalgan":
        benefitEffect = 2 * benefitEffect;
        break;
      case "Herbal Tea":
        benefitEffect = -1 * benefitEffect;
        break;
      case "Fervex":
        benefitEffect = this.handleFervexCase(currentDrug.expiresIn);
        break;
      default:
        benefitEffect = benefitEffect;
        break;
    }
    currentDrug.benefit = currentDrug.benefit - benefitEffect;
  }

  handlingBenefitCap(currentDrug) {
    if (currentDrug.benefit < 0) {
      currentDrug.benefit = 0;
    } else if (currentDrug.benefit > 50) {
      currentDrug.benefit = 50;
    }
  }

  updateBenefitValue() {
    for (var i = 0; i < this.drugs.length; i++) {
      // Note: Magic pill does not change over time, it's a very specific case
      if (this.drugs[i].name === "Magic Pill") {
        this.handlingBenefitCap(this.drugs[i]);
        return this.drugs;
      } else {
        this.updateExpiration(this.drugs[i]);
        this.updateDrugEfficiency(this.drugs[i]);
        this.handlingBenefitCap(this.drugs[i]);
      }

      // if (
      //   this.drugs[i].name != "Herbal Tea" &&
      //   this.drugs[i].name != "Fervex"
      // ) {
      //   if (this.drugs[i].benefit > 0) {
      //     if (this.drugs[i].name != "Magic Pill") {
      //       this.drugs[i].benefit = this.drugs[i].benefit - 1;
      //     }
      //   }
      // } else {
      //   if (this.drugs[i].benefit < 50) {
      //     this.drugs[i].benefit = this.drugs[i].benefit + 1;
      //     if (this.drugs[i].name == "Fervex") {
      //       if (this.drugs[i].expiresIn < 11) {
      //         if (this.drugs[i].benefit < 50) {
      //           this.drugs[i].benefit = this.drugs[i].benefit + 1;
      //         }
      //       }
      //       if (this.drugs[i].expiresIn < 6) {
      //         if (this.drugs[i].benefit < 50) {
      //           this.drugs[i].benefit = this.drugs[i].benefit + 1;
      //         }
      //       }
      //     }
      //   }
      // }
      // if (this.drugs[i].name != "Magic Pill") {
      //   this.drugs[i].expiresIn = this.drugs[i].expiresIn - 1;
      // }
      // if (this.drugs[i].expiresIn < 0) {
      //   if (this.drugs[i].name != "Herbal Tea") {
      //     if (this.drugs[i].name != "Fervex") {
      //       if (this.drugs[i].benefit > 0) {
      //         if (this.drugs[i].name != "Magic Pill") {
      //           this.drugs[i].benefit = this.drugs[i].benefit - 1;
      //         }
      //       }
      //     } else {
      //       this.drugs[i].benefit =
      //         this.drugs[i].benefit - this.drugs[i].benefit;
      //     }
      //   } else {
      //     if (this.drugs[i].benefit < 50) {
      //       this.drugs[i].benefit = this.drugs[i].benefit + 1;
      //     }
      //   }
      // }
    }

    return this.drugs;
  }
}
