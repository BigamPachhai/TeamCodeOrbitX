import Budget from "../models/Budget.js";
import Issue from "../models/Issue.js";

/**
 * Get budget summary
 */
export const getBudgetSummary = async (req, res) => {
  try {
    const { year } = req.query;
    const budgetYear = year || new Date().getFullYear().toString();

    const budgets = await Budget.find({ budgetYear });

    const totalAllocated = budgets.reduce((sum, b) => sum + (b.allocatedAmount || 0), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + (b.spentAmount || 0), 0);
    const totalRemaining = totalAllocated - totalSpent;

    // Group by department
    const departmentBreakdown = {};
    budgets.forEach((budget) => {
      if (!departmentBreakdown[budget.department]) {
        departmentBreakdown[budget.department] = {
          allocated: 0,
          spent: 0,
          issues: 0,
        };
      }
      departmentBreakdown[budget.department].allocated += budget.allocatedAmount || 0;
      departmentBreakdown[budget.department].spent += budget.spentAmount || 0;
    });

    // Get issue counts per department
    const issues = await Issue.find({ status: { $ne: "pending" } });
    issues.forEach((issue) => {
      const dept = issue.category || "General";
      if (departmentBreakdown[dept]) {
        departmentBreakdown[dept].issues = (departmentBreakdown[dept].issues || 0) + 1;
      }
    });

    const departments = Object.entries(departmentBreakdown).map(([name, data]) => ({
      name,
      allocated: data.allocated,
      spent: data.spent,
      remaining: data.allocated - data.spent,
      issues: data.issues,
    }));

    res.json({
      success: true,
      year: budgetYear,
      summary: {
        totalAllocated,
        totalSpent,
        totalRemaining,
        spentPercentage: totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0,
      },
      departments,
    });
  } catch (error) {
    console.error("Error getting budget summary:", error);
    res.status(500).json({ message: "Error getting budget summary", error: error.message });
  }
};

/**
 * Create or update budget for an issue
 */
export const createOrUpdateBudget = async (req, res) => {
  try {
    const { issueId, allocatedAmount, estimatedCost, notes } = req.body;

    const issue = await Issue.findById(issueId).populate("user");
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const budgetYear = new Date().getFullYear().toString();

    // Find existing budget or create new
    let budget = await Budget.findOne({ issue: issueId });

    if (budget) {
      // Update existing
      if (allocatedAmount !== undefined) budget.allocatedAmount = allocatedAmount;
      if (estimatedCost !== undefined) budget.estimatedCost = estimatedCost;
      if (notes !== undefined) budget.notes = notes;
      await budget.save();
    } else {
      // Create new
      budget = await Budget.create({
        issue: issueId,
        department: issue.category || "General",
        municipality: issue.municipality,
        category: issue.category,
        allocatedAmount: allocatedAmount || 0,
        estimatedCost: estimatedCost || 0,
        budgetYear,
        notes,
        status: "allocated",
      });
    }

    res.json({
      success: true,
      message: "Budget created/updated successfully",
      budget,
    });
  } catch (error) {
    console.error("Error creating/updating budget:", error);
    res.status(500).json({ message: "Error creating/updating budget", error: error.message });
  }
};

/**
 * Update spent amount
 */
export const updateSpentAmount = async (req, res) => {
  try {
    const { budgetId, spentAmount } = req.body;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    budget.spentAmount = spentAmount || 0;

    // Update status based on spending
    if (budget.spentAmount > budget.allocatedAmount) {
      budget.status = "over-budget";
    } else if (budget.spentAmount > 0) {
      budget.status = "in-progress";
    }

    await budget.save();

    res.json({
      success: true,
      message: "Spent amount updated",
      budget,
    });
  } catch (error) {
    console.error("Error updating spent amount:", error);
    res.status(500).json({ message: "Error updating spent amount", error: error.message });
  }
};

