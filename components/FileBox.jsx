import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {PhotographIcon, LinkIcon} from '@heroicons/react/outline'
import Avatar from './Avatar'
import {Button} from './ui'
import {Post } from '../scripts/fetch'

export default function FileBox ({currentUser})  {
    const [imageBoxOpen, setImageBoxOpen] = useState(false)
    const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

    const onSubmit = handleSubmit(async (formData) => {

        const image = formData.fileImage ? formData.fileImage : ''
        
        const data = {fileName: formData.fileName, file: formData.file, fileDescription: formData.fileDescription, imageUrl: image, user: currentUser._id}
        
        console.log(formData)
        Post('https://replfiles.api.dillonb07.studio/upload', data)
    })

    return (
        <form
      onSubmit={onSubmit}
      className="sticky top-16 md:top-20 z-50 shadow-sm border rounded-md border-[#4F5567] p-2 bg-[#2B3245] hover:border-[#71788A] transition duration-300"
    >
      <div className="flex items-center space-x-3">
        <Avatar />
        <input
          {...register("fileName", { required: true })}
          className="p-2 pl-5 outline-none flex-1 rounded-md bg-[#0F1524]"
          type="text"
          placeholder='File Nickname'
        />

        <PhotographIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 text-gray-300 cursor-pointer ${
            imageBoxOpen && "text-blue-300"
          }`}
        />
        <LinkIcon className="h-6 text-gray-300" />
      </div>

      {!!watch("fileName") && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">File:</p>
            <input
              {...register("file", {required: true})}
              className="m-2 flex-1 bg-[#0F1524] p-2 outline-none"
              type="file"
            />
          </div>

        <div className='flex flex-col py-2'>
            <div className='flex items-center px-2'>
                <p className='min-w-[90px]'>Description</p>
                <input {...register('fileDescription')} className='m-2 flex-1 bg-[#0F1524] p-2 outline-none' type='text' placeholder='Description (Optional)' />
            </div>
        </div>
          

          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                {...register("fileImage")}
                className="m-2 flex-1 bg-[#0F1524] p-2 outline-none"
                type="url"
                placeholder="Text (Optional)"
              />
            </div>
          )}

          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.fileName?.type === "required" && (
                <p>- A File Nickname is required</p>
              )}

              {errors.file?.type === "required" && (
                <p>- A file is required</p>
              )}
            </div>
          )}

          {!!watch("fileName") && (
            <Button
              btnType="submit"
              // classes="w-full rounded-full bg-blue-400 p-2 text-white"
            >
              Upload File
            </Button>
          )}
        </div>
      )}
    </form>
    )
}