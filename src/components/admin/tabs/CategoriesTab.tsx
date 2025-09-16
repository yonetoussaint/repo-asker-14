
import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit2, Trash2, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

// Sample category data structure
interface Category {
  id: number;
  name: string;
  shortName: string;
  isPopular: boolean;
  tags: string[];
  imageId: number;
}

// Complete list of demo categories - matching what's shown in SpaceSavingCategories.tsx
const demoCategories: Category[] = [
  { id: 1, name: 'Electronics', shortName: 'Electronics', tags: ['Hot'], isPopular: true, imageId: 1060 },
  { id: 2, name: 'Home & Kitchen', shortName: 'Home', tags: ['New'], isPopular: false, imageId: 1084 },
  { id: 3, name: 'Fashion', shortName: 'Fashion', tags: [], isPopular: true, imageId: 1027 },
  { id: 4, name: 'Beauty', shortName: 'Beauty', tags: ['Trending'], isPopular: true, imageId: 1062 },
  { id: 5, name: 'Sports', shortName: 'Sports', tags: [], isPopular: false, imageId: 1044 },
  { id: 6, name: 'Toys & Games', shortName: 'Toys', tags: [], isPopular: false, imageId: 1069 },
  { id: 7, name: 'Jewelry', shortName: 'Jewelry', tags: ['Premium'], isPopular: false, imageId: 1081 },
  { id: 8, name: 'Automotive', shortName: 'Auto', tags: [], isPopular: false, imageId: 1076 },
  { id: 9, name: 'Books', shortName: 'Books', tags: [], isPopular: false, imageId: 1050 },
  { id: 10, name: 'Pets', shortName: 'Pets', tags: ['New'], isPopular: false, imageId: 1025 },
  { id: 11, name: 'Food', shortName: 'Food', tags: [], isPopular: false, imageId: 1080 },
  { id: 12, name: 'Audio', shortName: 'Audio', tags: ['Premium'], isPopular: false, imageId: 1083 },
  { id: 13, name: 'Computers', shortName: 'Tech', tags: ['Hot'], isPopular: true, imageId: 1051 },
  { id: 14, name: 'Photography', shortName: 'Photo', tags: [], isPopular: false, imageId: 1061 },
  { id: 15, name: 'Watches', shortName: 'Watches', tags: [], isPopular: false, imageId: 1079 },
  { id: 16, name: 'Coffee', shortName: 'Coffee', tags: [], isPopular: false, imageId: 1060 },
  { id: 17, name: 'Movies', shortName: 'Movies', tags: ['Hot'], isPopular: false, imageId: 1032 }
];

const fetchCategories = async (): Promise<Category[]> => {
  // This would fetch from an API in a real app
  return new Promise((resolve) => {
    setTimeout(() => resolve(demoCategories), 500);
  });
};

const CategoriesTab: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category> | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchCategories,
  });

  // In a real app, these mutations would make API calls
  const updateMutation = useMutation({
    mutationFn: async (category: Category) => {
      // Simulate API call
      return new Promise<Category>((resolve) => {
        setTimeout(() => resolve(category), 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: "Category updated", description: "The category has been updated successfully." });
      setEditingCategory(null);
    }
  });

  const createMutation = useMutation({
    mutationFn: async (category: Partial<Category>) => {
      // Simulate API call
      return new Promise<Category>((resolve) => {
        const newCat = {
          ...category,
          id: Math.max(...categories.map(c => c.id), 0) + 1,
          tags: category.tags || [],
          imageId: category.imageId || 1060
        } as Category;
        setTimeout(() => resolve(newCat), 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: "Category created", description: "The new category has been added successfully." });
      setNewCategory(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: "Category deleted", description: "The category has been removed successfully." });
    }
  });

  const handleEdit = (category: Category) => {
    setEditingCategory({...category});
    setImagePreview(`https://picsum.photos/id/${category.imageId}/80/80`);
  };

  const handleSaveEdit = () => {
    if (editingCategory) {
      updateMutation.mutate(editingCategory);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setImagePreview(null);
  };

  const handleCreateNew = () => {
    setNewCategory({ name: '', shortName: '', isPopular: false, tags: [], imageId: 1060 });
    setImagePreview('https://picsum.photos/id/1060/80/80');
  };

  const handleSaveNew = () => {
    if (newCategory && newCategory.name && newCategory.shortName) {
      createMutation.mutate(newCategory);
    } else {
      toast({ title: "Validation error", description: "Name and Short Name are required." });
    }
  };

  const handleCancelNew = () => {
    setNewCategory(null);
    setImagePreview(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isNewCategory: boolean) => {
    const imageId = parseInt(e.target.value);
    if (!isNaN(imageId)) {
      setImagePreview(`https://picsum.photos/id/${imageId}/80/80`);
      if (isNewCategory && newCategory) {
        setNewCategory({...newCategory, imageId});
      } else if (editingCategory) {
        setEditingCategory({...editingCategory, imageId});
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Categories Management</h2>
        <Button onClick={handleCreateNew} disabled={!!newCategory || !!editingCategory}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {newCategory && (
        <div className="bg-white p-4 rounded-md shadow mb-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <Label htmlFor="new-name">Name</Label>
                <Input 
                  id="new-name" 
                  value={newCategory.name || ''} 
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} 
                  placeholder="Category Name" 
                />
              </div>
              <div>
                <Label htmlFor="new-shortname">Short Name</Label>
                <Input 
                  id="new-shortname" 
                  value={newCategory.shortName || ''} 
                  onChange={(e) => setNewCategory({...newCategory, shortName: e.target.value})} 
                  placeholder="Short Display Name" 
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="new-popular" 
                  checked={newCategory.isPopular || false}
                  onChange={(e) => setNewCategory({...newCategory, isPopular: e.target.checked})}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="new-popular">Mark as Popular</Label>
              </div>
              <div>
                <Label htmlFor="new-tags">Tags (comma separated)</Label>
                <Input 
                  id="new-tags" 
                  value={newCategory.tags?.join(', ') || ''} 
                  onChange={(e) => setNewCategory({...newCategory, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)})} 
                  placeholder="Hot, New, etc." 
                />
              </div>
              <div>
                <Label htmlFor="new-imageId">Image ID</Label>
                <Input 
                  id="new-imageId" 
                  type="number" 
                  value={newCategory.imageId || 1060} 
                  onChange={(e) => handleImageChange(e, true)} 
                  placeholder="Image ID" 
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              {imagePreview && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Image Preview</div>
                  <img 
                    src={imagePreview} 
                    alt="Category Preview" 
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleCancelNew}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveNew}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Short Name</TableHead>
            <TableHead>Popular</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              {editingCategory && editingCategory.id === category.id ? (
                <>
                  <TableCell>
                    <div className="flex flex-col items-center">
                      <img 
                        src={imagePreview || `https://picsum.photos/id/${category.imageId}/80/80`} 
                        alt={category.name} 
                        className="w-12 h-12 object-cover rounded-md mb-1"
                      />
                      <Input 
                        type="number" 
                        value={editingCategory.imageId} 
                        onChange={(e) => handleImageChange(e, false)} 
                        className="w-20 text-xs"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={editingCategory.name} 
                      onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={editingCategory.shortName} 
                      onChange={(e) => setEditingCategory({...editingCategory, shortName: e.target.value})}
                    />
                  </TableCell>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={editingCategory.isPopular}
                      onChange={(e) => setEditingCategory({...editingCategory, isPopular: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={editingCategory.tags.join(', ')} 
                      onChange={(e) => setEditingCategory({
                        ...editingCategory, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      })}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>
                    <img 
                      src={`https://picsum.photos/id/${category.imageId}/80/80`} 
                      alt={category.name} 
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.shortName}</TableCell>
                  <TableCell>{category.isPopular ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{category.tags.join(', ')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(category)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesTab;
