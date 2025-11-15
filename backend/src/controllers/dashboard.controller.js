import * as dashboardService from "../services/dashboard.service.js";

export const overview = async (req, res, next) => {
  try {
    const data = await dashboardService.getOverview();
    res.json({
      success: true,
      ...data,
    });
  } catch (err) {
    next(err);
  }
};

export const topUsers = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const data = await dashboardService.getTopUsers(limit);
    res.json({
      success: true,
      topUsers: data,
    });
  } catch (err) {
    next(err);
  }
};

export const topCategories = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const data = await dashboardService.getTopCategories(limit);
    res.json({
      success: true,
      topCategories: data,
    });
  } catch (err) {
    next(err);
  }
};

export const topArticles = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const data = await dashboardService.getTopArticles(limit);
    res.json({
      success: true,
      topArticles: data,
    });
  } catch (err) {
    next(err);
  }
};

export const recentUsers = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const data = await dashboardService.getRecentUsers(limit);
    res.json({
      success: true,
      recentUsers: data,
    });
  } catch (err) {
    next(err);
  }
};

export const recentArticles = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const data = await dashboardService.getRecentArticles(limit);
    res.json({
      success: true,
      recentArticles: data,
    });
  } catch (err) {
    next(err);
  }
};

export const userGrowth = async (req, res, next) => {
  try {
    const monthsBack = req.query.months
      ? Number(req.query.months)
      : 6;

    const data = await dashboardService.getUserGrowth(monthsBack);
    res.json({
      success: true,
      monthsBack,
      userGrowth: data,
    });
  } catch (err) {
    next(err);
  }
};
