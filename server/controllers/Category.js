// const { Mongoose } = require("mongoose");
const {Mongoose} = require("mongoose");
const Category = require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }


// createTag handler function
exports.createCategory = async (req,res) =>{
    try {
        // fetch data from request body
        const {name, description} = req.body;

        // validation on name and description
        if(!name || !description ){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        // tag entry in db 
        const CategorysDetails = await Category.create({
            name:name,
            description: description,
			
			
        });
      

        // return 
        return res.status(200).json({
            success:true,
            message: "Category created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message
        });
    }
}

// getAlltags handler function
exports.showAllCategories = async (req,res) =>{
    try {
        
        const allCategorys = await Category.find({}).populate("courses").exec();
		
        res.status(200).json({
            success:true,
            message: " All Tags returned successfully",
            data: allCategorys,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Something went wrong while getting all tags",
            error: error.message
        });
    }
};

exports.categoryPageDetails = async (req, res) => {
	try {
		const { categoryId } = req.body;

		// Get courses for the specified category
		const selectedCategory = await Category.findById(categoryId).populate({
			path:"courses",
			match: {status:"Published"},
			populate: "ratingAndReviews",
		})
		.exec();
						  
			
		console.log("SELECTED COURSE",selectedCategory);
		// Handle the case when the category is not found
		if (!selectedCategory) {
			console.log("Category not found.");
			return res
				.status(404)
				.json({ success: false, message: "Category not found" });
		}
		// Handle the case when there are no courses
		if (selectedCategory.courses.length === 0) {
			console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}

		// Get courses for other categories
		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		})
		let differentCategory = await Category.findOne(
			categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
			  ._id
		  ).populate({
			  path: "courses",
			  match: { status: "Published" },
			}).exec()
        console.log("Different COURSE", differentCategory)

		// Get top-selling courses across all categories
		const allCategories = await Category.find().populate({
			path:"courses",
			match: { status: "Published" },
			populate:{
				path:"instructor"
			}
		}).exec()
		console.log("all categories", allCategories);

		
		const allCourses = allCategories.flatMap((category) => category.courses);
		console.log("allCourses", allCourses);
		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 10);
       console.log("mostSellingCourses COURSE", mostSellingCourses)


		res.status(200).json({
			success: true,
            data: {
              selectedCategory,
              differentCategory,
              mostSellingCourses,
        },
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};