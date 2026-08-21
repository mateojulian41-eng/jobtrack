const prisma = require("../config/prisma");

const validWorkModes = [
  "REMOTE",
  "HYBRID",
  "ONSITE",
  "NOT_SPECIFIED",
];

const validStatuses = [
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "TECHNICAL_TEST",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

async function createApplication(request, response) {
  try {
    const {
      company,
      position,
      jobUrl,
      location,
      workMode,
      source,
      applicationDate,
      status,
      technologies,
      notes,
    } = request.body;

    if (!company || !position) {
      return response.status(400).json({
        status: "error",
        message: "Company and position are required",
      });
    }

    if (workMode && !validWorkModes.includes(workMode)) {
      return response.status(400).json({
        status: "error",
        message: "Invalid work mode",
      });
    }

    if (status && !validStatuses.includes(status)) {
      return response.status(400).json({
        status: "error",
        message: "Invalid application status",
      });
    }

    if (technologies && !Array.isArray(technologies)) {
      return response.status(400).json({
        status: "error",
        message: "Technologies must be an array",
      });
    }

    const parsedApplicationDate = applicationDate
      ? new Date(applicationDate)
      : null;

    if (
      parsedApplicationDate &&
      Number.isNaN(parsedApplicationDate.getTime())
    ) {
      return response.status(400).json({
        status: "error",
        message: "Invalid application date",
      });
    }

    const application = await prisma.application.create({
      data: {
        company: company.trim(),
        position: position.trim(),
        jobUrl: jobUrl?.trim() || null,
        location: location?.trim() || null,
        workMode: workMode || "NOT_SPECIFIED",
        source: source?.trim() || null,
        applicationDate: parsedApplicationDate,
        status: status || "SAVED",
        technologies: technologies || [],
        notes: notes?.trim() || null,
        userId: request.user.id,
      },
    });

    return response.status(201).json({
      status: "success",
      message: "Application created successfully",
      data: {
        application,
      },
    });
  } catch (error) {
    console.error("Create application error:", error);

    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

async function getApplications(request, response) {
  try {
    const { status, workMode, search } = request.query;

    if (status && !validStatuses.includes(status)) {
      return response.status(400).json({
        status: "error",
        message: "Invalid application status",
      });
    }

    if (workMode && !validWorkModes.includes(workMode)) {
      return response.status(400).json({
        status: "error",
        message: "Invalid work mode",
      });
    }

    const applications = await prisma.application.findMany({
      where: {
        userId: request.user.id,
        ...(status && {
          status,
        }),
        ...(workMode && {
          workMode,
        }),
        ...(search && {
          OR: [
            {
              company: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              position: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response.status(200).json({
      status: "success",
      results: applications.length,
      data: {
        applications,
      },
    });
  } catch (error) {
    console.error("Get applications error:", error);

    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

async function getApplicationById(request, response) {
  try {
    const applicationId = Number(request.params.id);

    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      return response.status(400).json({
        status: "error",
        message: "Invalid application ID",
      });
    }

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId: request.user.id,
      },
    });

    if (!application) {
      return response.status(404).json({
        status: "error",
        message: "Application not found",
      });
    }

    return response.status(200).json({
      status: "success",
      data: {
        application,
      },
    });
  } catch (error) {
    console.error("Get application by ID error:", error);

    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

async function updateApplication(request, response) {
  try {
    const applicationId = Number(request.params.id);

    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      return response.status(400).json({
        status: "error",
        message: "Invalid application ID",
      });
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId: request.user.id,
      },
    });

    if (!existingApplication) {
      return response.status(404).json({
        status: "error",
        message: "Application not found",
      });
    }

    const {
      company,
      position,
      jobUrl,
      location,
      workMode,
      source,
      applicationDate,
      status,
      technologies,
      notes,
    } = request.body;

    if (company !== undefined && !company.trim()) {
      return response.status(400).json({
        status: "error",
        message: "Company cannot be empty",
      });
    }

    if (position !== undefined && !position.trim()) {
      return response.status(400).json({
        status: "error",
        message: "Position cannot be empty",
      });
    }

    if (workMode && !validWorkModes.includes(workMode)) {
      return response.status(400).json({
        status: "error",
        message: "Invalid work mode",
      });
    }

    if (status && !validStatuses.includes(status)) {
      return response.status(400).json({
        status: "error",
        message: "Invalid application status",
      });
    }

    if (technologies !== undefined && !Array.isArray(technologies)) {
      return response.status(400).json({
        status: "error",
        message: "Technologies must be an array",
      });
    }

    let parsedApplicationDate;

    if (applicationDate !== undefined) {
      parsedApplicationDate = applicationDate
        ? new Date(applicationDate)
        : null;

      if (
        parsedApplicationDate &&
        Number.isNaN(parsedApplicationDate.getTime())
      ) {
        return response.status(400).json({
          status: "error",
          message: "Invalid application date",
        });
      }
    }

    const application = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        ...(company !== undefined && {
          company: company.trim(),
        }),
        ...(position !== undefined && {
          position: position.trim(),
        }),
        ...(jobUrl !== undefined && {
          jobUrl: jobUrl?.trim() || null,
        }),
        ...(location !== undefined && {
          location: location?.trim() || null,
        }),
        ...(workMode !== undefined && {
          workMode,
        }),
        ...(source !== undefined && {
          source: source?.trim() || null,
        }),
        ...(applicationDate !== undefined && {
          applicationDate: parsedApplicationDate,
        }),
        ...(status !== undefined && {
          status,
        }),
        ...(technologies !== undefined && {
          technologies,
        }),
        ...(notes !== undefined && {
          notes: notes?.trim() || null,
        }),
      },
    });

    return response.status(200).json({
      status: "success",
      message: "Application updated successfully",
      data: {
        application,
      },
    });
  } catch (error) {
    console.error("Update application error:", error);

    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
};