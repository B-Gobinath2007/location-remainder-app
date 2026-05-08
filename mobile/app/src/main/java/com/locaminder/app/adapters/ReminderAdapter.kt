package com.locaminder.app.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.locaminder.app.databinding.ItemReminderBinding
import com.locaminder.app.models.Reminder

class ReminderAdapter(
    private var reminders: List<Reminder>,
    private val onDeleteClick: (String, Int) -> Unit
) : RecyclerView.Adapter<ReminderAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemReminderBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemReminderBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val reminder = reminders[position]
        holder.binding.textTitle.text = reminder.title
        holder.binding.textDetails.text = "Lat: ${reminder.latitude}, Lng: ${reminder.longitude} • ${reminder.radius}m radius"
        
        holder.binding.btnDelete.setOnClickListener {
            onDeleteClick(reminder._id, position)
        }
    }

    override fun getItemCount() = reminders.size

    fun updateData(newReminders: List<Reminder>) {
        reminders = newReminders
        notifyDataSetChanged()
    }
}
