import Image from "next/image";

function Avatar({ source='/logo.png', unRounded=false, large=false, priority=false, background='white' }) {
  return (
    <div
      className={`relative overflow-hidden h-10 w-10 border-gray-300 ${background === 'white' ? 'bg-white' : `bg-[#${background}]`} ${
        large && "h-20 w-20"
      } ${!unRounded && 'rounded-full'}`}
    >
      <Image
        priority={priority}
        src={source}
        layout="fill"
        className='h-20 w-20'
      />
    </div>
  );
}
export default Avatar;
