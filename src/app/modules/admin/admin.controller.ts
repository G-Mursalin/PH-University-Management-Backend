import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { adminServices } from './admin.service';

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await adminServices.getAllAdmins(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admins are retrieved successfully',
    data: result,
  });
});

const getAdminByID = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminServices.getAdminByID(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin retrieved successfully',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;

  const result = await adminServices.updateAdmin(id, admin);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is updated successfully',
    data: result,
  });
});

const deleteAdminByID = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminServices.deleteAdminByID(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin deleted successfully',
    data: result,
  });
});

export const adminControllers = {
  getAllAdmins,
  getAdminByID,
  updateFaculty,
  deleteAdminByID,
};
